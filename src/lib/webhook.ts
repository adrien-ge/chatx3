// Service pour gérer les webhooks vers n8n
export interface WebhookMessageData {
  user_id: string;
  conversation_id: string;
  message_id: string;
  message_content: string;
  conversation_type: string;
  user_email?: string;
  company_name?: string;
}

export interface WebhookResponse {
  success: boolean;
  response?: string;
  error?: string;
  retryable?: boolean;
}

class WebhookService {
  private readonly webhookUrl: string;
  
  constructor() {
    // Utiliser une variable d'environnement pour l'URL du webhook
    this.webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string;
    
    // Valider la présence de l'URL du webhook
    if (!this.webhookUrl) {
      console.error('❌ WEBHOOK: URL du webhook non configurée. Veuillez définir VITE_N8N_WEBHOOK_URL dans votre fichier .env');
    } else {
      console.log('🔗 WEBHOOK: Service initialisé avec URL:', this.webhookUrl);
    }
  }

  private isRetryableError(status: number, errorText: string): boolean {
    // Erreurs temporaires qui peuvent être réessayées
    if (status >= 500 && status <= 599) return true; // Erreurs serveur
    if (status === 429) return true; // Rate limiting
    if (status === 408) return true; // Request timeout
    
    // Analyser le contenu de l'erreur
    const retryableKeywords = ['timeout', 'temporary', 'overload', 'busy', 'workflow'];
    return retryableKeywords.some(keyword => errorText.toLowerCase().includes(keyword));
  }
  
  async sendMessageWebhook(data: WebhookMessageData): Promise<WebhookResponse> {
    // Vérifier si l'URL du webhook est configurée
    if (!this.webhookUrl) {
      return {
        success: false,
        error: 'Service webhook non configuré. Veuillez contacter l\'administrateur.',
        retryable: false
      };
    }

    try {
      console.log(`🔗 WEBHOOK: Envoi de la requête vers n8n...`, {
        url: this.webhookUrl,
        conversation_id: data.conversation_id,
        message_id: data.message_id,
        user_id: data.user_id,
        conversation_type: data.conversation_type,
        message_preview: data.message_content.substring(0, 50) + '...'
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes timeout (600 secondes)

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Intell-X3-App/1.0',
          'Accept': 'application/json',
          'X-Request-ID': `${data.message_id}-${Date.now()}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ WEBHOOK: Erreur HTTP:`, response.status, errorText);
        
        // Analyser le type d'erreur pour déterminer si on peut réessayer
        const isRetryable = this.isRetryableError(response.status, errorText);
        
        if (response.status === 500) {
          let errorMessage = 'Le service IA rencontre des difficultés techniques.';
          
          // Analyser le message d'erreur pour donner plus de contexte
          if (errorText.includes('Error in workflow')) {
            errorMessage = 'Le workflow IA est temporairement indisponible. Notre équipe technique a été notifiée.';
          } else if (errorText.includes('timeout')) {
            errorMessage = 'Le service IA met trop de temps à répondre. Veuillez réessayer avec une question plus simple.';
          } else if (errorText.includes('database') || errorText.includes('connection')) {
            errorMessage = 'Problème de connexion à la base de connaissances. Veuillez réessayer dans quelques instants.';
          }
          
          return { 
            success: false, 
            error: errorMessage,
            retryable: isRetryable
          };
        }
        
        if (response.status === 502 || response.status === 503 || response.status === 504) {
          return {
            success: false,
            error: 'Le service IA est temporairement surchargé. Veuillez réessayer dans quelques instants.',
            retryable: true
          };
        }
        
        return { 
          success: false, 
          error: `Erreur du service IA (${response.status}). Veuillez contacter le support si le problème persiste.`,
          retryable: isRetryable
        };
      }

      const responseData = await response.json();
      console.log(`✅ WEBHOOK: Réponse reçue:`, responseData);
      
      // Extraire la réponse du format complexe retourné par n8n
      let assistantResponse = '';
      
      if (Array.isArray(responseData) && responseData.length > 0) {
        const firstItem = responseData[0];
        if (firstItem.response?.body?.response) {
          assistantResponse = firstItem.response.body.response;
        } else if (firstItem.response) {
          assistantResponse = firstItem.response;
        } else if (typeof firstItem === 'string') {
          assistantResponse = firstItem;
        }
      } else if (responseData.response) {
        assistantResponse = responseData.response;
      } else if (typeof responseData === 'string') {
        assistantResponse = responseData;
      }

      if (!assistantResponse) {
        console.warn('⚠️ WEBHOOK: Réponse vide ou format inattendu:', responseData);
        assistantResponse = 'Désolé, je n\'ai pas pu générer une réponse appropriée. Veuillez reformuler votre question ou réessayer.';
      }

      console.log('📝 WEBHOOK: Réponse extraite:', assistantResponse.substring(0, 100) + '...');
      
      return { 
        success: true, 
        response: assistantResponse 
      };

    } catch (error) {
      console.error(`❌ WEBHOOK: Erreur réseau:`, error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { 
            success: false, 
            error: 'Le service IA a dépassé le délai maximum de traitement (10 minutes). Veuillez réessayer avec une question plus courte ou plus spécifique.',
            retryable: true
          };
        }
        
        // Gestion des erreurs de réseau
        if (error.message.includes('fetch') || error.message.includes('network')) {
          return { 
            success: false, 
            error: 'Problème de connexion réseau. Vérifiez votre connexion internet et réessayez.',
            retryable: true
          };
        }
        
        return { 
          success: false, 
          error: `Erreur de communication: ${error.message}`,
          retryable: false
        };
      }
      
      return { 
        success: false, 
        error: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
        retryable: true
      };
    }
  }

  // Fonction pour préparer les données du webhook avec le type de conversation
  async prepareWebhookData(
    message: any,
    conversation: any,
    user: any
  ): Promise<WebhookMessageData> {
    return {
      user_id: user.id,
      conversation_id: conversation.id,
      message_id: message.id,
      message_content: message.content,
      conversation_type: conversation.type,
      user_email: user.email,
      company_name: user.company?.name || 'Non définie'
    };
  }

  // Fonction de test pour vérifier la connectivité
  async testWebhook(): Promise<WebhookResponse> {
    if (!this.webhookUrl) {
      return {
        success: false,
        error: 'URL du webhook non configurée',
        retryable: false
      };
    }

    try {
      console.log('🧪 WEBHOOK: Test de connectivité...');
      
      const testData = {
        user_id: 'test-user',
        conversation_id: 'test-conversation',
        message_id: 'test-message',
        message_content: 'Test de connectivité webhook',
        conversation_type: 'Question'
      };

      return await this.sendMessageWebhook(testData);
    } catch (error) {
      console.error('❌ WEBHOOK: Erreur test:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur test webhook',
        retryable: false
      };
    }
  }

  // Méthode pour vérifier la configuration
  isConfigured(): boolean {
    return !!this.webhookUrl;
  }

  // Méthode pour obtenir l'URL configurée (pour debug)
  getWebhookUrl(): string {
    return this.webhookUrl;
  }
}

export const webhookService = new WebhookService();
