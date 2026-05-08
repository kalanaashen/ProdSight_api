const authService =
  require("../services/authService");

exports.login = async (req, res) => {

  try {

    const token =
      await authService.loginUser(
        req.body
      );

    res.send(token);

  } catch (err) {

    res.status(400).send(
      err.message
    );

  }

};