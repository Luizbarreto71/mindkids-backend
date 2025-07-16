const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ userId: user._id });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(400).json({ error: 'Erro ao registrar usuário' });
  }
};

const checkUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ isPaid: user.isPaid });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
};

module.exports = { registerUser, checkUserStatus };