module.exports = {
    "GET": (_, res) => res.send({ message: "Hello you!" }),
    "POST /login": (req, res) => {
        res.send({
            yeah: "das bin ich"
        });
    }
};