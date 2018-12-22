var Twocheckout = require("2checkout-node");
var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
// app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.urlencoded());

app.get("/", function(request, response) {
  response.render("index");
});

app.post("/order", function(request, response) {
  var tco = new Twocheckout({
    sellerId: "901400760", // Seller ID, required for all non Admin API bindings
    privateKey: "A54F96DA-D489-4264-AC08-43DC22871043", // Payment API private key, required for checkout.authorize binding
    sandbox: true // Uses 2Checkout sandbox URL for all bindings
  });

  var params = {
    merchantOrderId: "1235678",
    token: request.body.token,
    currency: "USD",
    total: request.body.total,
    billingAddr: {
      name: request.body.name,
      addrLine1: request.body.address,
      city: request.body.city,
      state: request.body.state,
      zipCode: request.body.zip,
      country: request.body.country,
      email: request.body.email,
      phoneNumber: request.body.phone
    }
  };

  tco.checkout.authorize(params, function(error, data) {
    if (error) {
      response.send(error.message);
    } else {
      response.sendFile(path.join(__dirname + "/public/paysuccess.html"));
      //app.use("/paysuccess", paysuccessRouter);
      //   response.send(data.response.responseMsg);
    }
  });
});

http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});
