const User = require("../models/user");

// Controller that renders registration form
module.exports.renderRegister = (req, res) => {
  // If user is authenticated, redirect
  if (req.user) {
    return res.redirect("/");
  }

  res.render("users/register");
};

// Controller that handles user registration
module.exports.register = async (req, res, next) => {
  try {
    // Retrieve form data
    const { email, username, password } = req.body;
    // Create new user and register
    const user = new User({ email, username });
    // Save user with hashed password in passport
    const registeredUser = await User.register(user, password);
    // Login new user
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      // Redirect to bench index page
      req.flash("success", "Account created successfully");
      res.redirect("/benches");
    });
  } catch (e) {
    req.flash("danger", e.message);
    res.redirect("register");
  }
};

// Controller that renders login form
module.exports.renderLogin = (req, res) => {
  // If user is already authenticated, redirect
  if (req.user) {
    return res.redirect("/");
  }

  res.render("users/login");
};

// Controller that handles user login
// The authentication itself takes place in passport middleware
module.exports.login = (req, res) => {
  // Flash and redirect to session.next (the page that the user was redirected from)
  req.flash("success", "You logged in successfully");
  const redirectUrl = req.session.next || "/benches";
  // Delete session.next
  delete req.session.next;
  res.redirect(redirectUrl);
};

// Controller that handles user logout
module.exports.logout = (req, res, next) => {
  // If user is not authenticated, redirect
  if (!req.user) {
    return res.redirect("/");
  }
  // Logout user with passport
  req.logout((err) => {
    if (err) return next(err);
    // Flash and redirect to homepage
    req.flash("success", "You logged out successfully");
    res.redirect("/");
  });
};
