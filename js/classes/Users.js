class Users {
  constructor() {
    this.users = [];
    this.currentUser = null;
    this.ready = this.loadUsers();
  }

  saveToLocalStorage() {
    localStorage.setItem("users", JSON.stringify(this.users));
  }

  async loadUsers() {
    const storedUsers = localStorage.getItem("users");

    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      // If not, fetch from JSON file and store in localStorage
      try {
        const response = await fetch("../data/users.json");
        if (!response.ok) {
          throw new Error("Failed to fetch users data");
        }
        this.users = await response.json();
        this.saveToLocalStorage();
      } catch (error) {
        console.error("Error loading users data:", error);
      }
    }
    // Check if there's a logged-in user
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      this.currentUser = JSON.parse(loggedInUser);
    }
  }
  getUsers() {
    return this.users;
  }

  register(username, email, password, phone, name) {
    const existingUser = this.users.find(
      (user) => user.username === username || user.email === email
    );

    if (existingUser) {
      return {
        success: false,
        message: "Username or email already exists!",
      };
    }

    const newUser = {
      id: this.users.length + 1,
      username,
      email,
      password,
      role: "customer",
      phone,
      name,
    };
    this.users.push(newUser);
    this.saveToLocalStorage();
    this.currentUser = newUser;
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return {
      success: true,
      message: "Registration successful!",
      user: newUser,
    };
  }

  login(username, password) {
    const user = this.users.find(
      (user) =>
        (user.username === username || user.email === username) &&
        user.password === password
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid username or password!",
      };
    }

    const userInfo = { ...user };
    delete userInfo.password; // Remove password from user info

    this.currentUser = userInfo;
    localStorage.setItem("currentUser", JSON.stringify(userInfo));

    return {
      success: true,
      message: "Login successful!",
      user: userInfo,
    };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    return {
      success: true,
      message: "Logout successful!",
    };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserById(id) {
    return this.users.find((user) => user.id === id);
  }
  getUserByEmail(email) {
    return this.users.find((user) => user.email === email);
  }
}

export default Users;
