const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public', { index: false }))
const port = 3000;

let users = [];

const loadUsers = () => {
    try {
        const data = fs.readFileSync(__dirname + '/users.json');
        users = JSON.parse(data);
    } catch (error) {
        users = [];

    }
};

const saveUsers = () => {
    fs.writeFileSync(__dirname + '/users.json', JSON.stringify(users, null, 2));
};

loadUsers();

const displayStaticHtml = (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
};

const register = (req, res) => {
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };

    if (users.find((user) => user.email === newUser.email)) {
        res.send("user already registered");
        return;
    }
    if (newUser.password !== req.body.cpassword) {
        res.send("Password and Current Password doesn't match");
        return;
    }
    users.push(newUser);
    saveUsers();
    res.send("user registered");
};

const login = (req, res) => {
    const userAuth = req.body;
    const user = users.find((user) => user.email === userAuth.email);
    if (!user) {
        res.send("Signin failed, please signup before signin");
        return;
    }
    if (userAuth.password !== user.password) {
        res.send("Incorrect Password");
        return;
    }

    res.send(`Login Success, Welcome ${user.name}`);
}

app.route("/")
    .get(displayStaticHtml)
    .post(login);

app.route("/signup")
    .post(register);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});