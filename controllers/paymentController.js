const { Preference } = require('mercadopago');
const client = require('../src/config/mercadopago');
const User = require('../models/User');

const createPayment = async (req, res) => {
  try {
    const { userId, title, price, quantity } = req.body;

    // Verificar se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const preference = new Preference(client);
    const body = {
      items: [
        {
          title,
          unit_price: Number(price),
          quantity: Number(quantity),
        },
      ],
      back_urls: {
        success: 'https://mindkidss.com/success',
        failure: 'https://mindkidss.com/failure',
        pending: 'https://mindkidss.com/pending',
      },
      auto_return: 'approved',
      external_reference: userId, // Para identificar o usuário no retorno
    };

    const response = await preference.create({ body });
    res.json({ init_point: response.init_point });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
};

// Endpoint para processar retorno do Mercado Pago
const handlePaymentReturn = async (req, res) => {
  try {
    const { status, external_reference } = req.query;

    if (status === 'approved') {
      // Atualizar usuário para pago
      await User.findByIdAndUpdate(external_reference, { isPaid: true });
      return res.redirect('https://mindkidss.com/success');
    }
    res.redirect('https://mindkidss.com/failure');
  } catch (error) {
    console.error('Erro ao processar retorno:', error);
    res.redirect('https://mindkidss.com/failure');
  }
};

module.exports = { createPayment, handlePaymentReturn };