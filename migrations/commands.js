truf.cmd console


FutureBanking.deployed().then(function(instance) {app=instance;})

app.addCustomer("127163245", "Andrei Mititelu");

app.addCredit ("127163245", "BCR", "Mortgage", 12314, 100000, 12, 123487329842743, 123487329842743, 8, 1200, 5, 700);
app.addCredit ("127163245", "Raiffeisen", "Mortgage", 122145, 100000, 12, 123487329842743, 123487329842743, 8, 1200, 5, 700);


app.searchCreditFinancialInstitutions("127163245");
app.searchCreditDetails("127163245");
app.searchRemainingPayments ("127163245");

app.bytes32ToString(0x4243520000000000000000000000000000000000000000000000000000000000);



app.addCustomer("1911222376817", "Andrei Mititelu");
app.addCredit ("1911222376817", "Allianz", "New Car Leasing", 222223, 67600, 60, 123487329842743, 123487329842743, 30, 1200, 9.6, 700);
app.addCredit ("1911222376817", "Provident", "Fast Loan", 222224, 5200, 12, 123487329842743, 123487329842743, 0, 550, 17.8, 600);
app.addCredit ("1911222376817", "ING", "Happy House", 222225, 327000, 240, 123487329842743, 123487329842743, 120, 1450, 6.3, 700);