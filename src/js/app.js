App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: async function() {
    // Load

    console.log ("App Loaded!");
    return await App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    console.log ("Web3 Provider: ", web3.currentProvider);
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    App.displayAccountInfo();
    return App.initContract();
  },

  // Display Account Info
  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      console.log ("Account:", account);
      console.log ("Error:", err);

      if (account !== null) {
        App.account = account;
        console.log (account);
        web3.eth.getBalance(account, function(err, balance) {
          console.log ("Balance:", balance);
          if (err === null) {
            // $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH");
          }
        });
      } else {
        var url = new URL(window.location.href);
        if (url.pathname != "/") {
          // Redirect to lock screen
          window.location.replace("/");
        }
      }
    });
  },

  initContract: function() {
    $.getJSON('FutureBanking.json', function(futureBankingArtifact) {
      // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
      App.contracts.FutureBanking = TruffleContract(futureBankingArtifact);

      // Set the provider for our contract.
      App.contracts.FutureBanking.setProvider(App.web3Provider);

      // Display Stats
    });

    // return App.bindEvents();
  },

  search: function() {

    console.log ("Search!");
    var identificationCode = $("#nationalid").val().trim();
    // $("#SSN")[0].value = $("#nationalid").val().trim();
    if (search.length != 0) {
      App.contracts.FutureBanking.deployed().then(function(instance) {
        instance.searchCreditFinancialInstitutions(identificationCode).then(function (results) {
          console.log ("Financial Institutions!");
          console.log (results);


          if (results[0].length != 0) {
              console.log (results[0].length);

              // Generate Table Rows 


              for (var i=1; i < results[0].length; i++) {

                  

                  /* console.log (web3.toAscii(results[0][i]).replace(/\0/g, ''));
                  console.log (web3.toAscii(results[1][i]).replace(/\0/g, ''));
                  console.log (results[2][i].c[0]); */

                  var tableCells = "";
                  tableCells += "<td class='institution'><img src='images/"+ web3.toAscii(results[0][i]).replace(/\0/g, '').toLowerCase() +".png' width='100'/></td>";
                  tableCells += "<td class='product'>"+ web3.toAscii(results[1][i]).replace(/\0/g, '') +"</td>";
                  tableCells += "<td class='amount'></td>";
                  tableCells += "<td class='duration'></td>";
                  tableCells += "<td class='startDate'></td>";
                  tableCells += "<td class='endDate'></td>";
                  tableCells += "<td class='remainingPayments'></td>";
                  tableCells += "<td class='monthlyPayments'></td>";
                  tableCells += "<td class='interestRate'></td>";
                  tableCells += "<td class='creditRating'></td>";


                  // console.log (web3.toAscii(results[0][i]).replace(/\0/g, ''));
                  $("#credit-history tbody").append("<tr class='" + results[2][i].c[0] + "'>" + tableCells + "</tr>");

              }

            
              // Search Credit Details

              instance.searchCreditDetails(identificationCode).then(function (results) {
                console.log ("Credit Details!");
                console.log (results);
                if (results[0].length != 0) {
                  for (var i=1; i< results[0].length; i++) {

                    $("#credit-history tbody tr." + results[4][i].c[0] + " td.amount").html(results[0][i].c[0]);
                    $("#credit-history tbody tr." + results[4][i].c[0] + " td.duration").html(results[1][i].c[0]);
                    $("#credit-history tbody tr." + results[4][i].c[0] + " td.startDate").html(new Date(results[2][i].c[1] ));
                    $("#credit-history tbody tr." + results[4][i].c[0] + " td.endDate").html(new Date(results[3][i].c[1]));

                    var monthlyPayments = parseFloat($("#credit-history tbody tr." + results[4][i].c[0] + " td.amount")[0].innerHTML) / 
                         parseFloat($("#credit-history tbody tr." + results[4][i].c[0] + " td.duration")[0].innerHTML); 

                    $("#credit-history tbody tr." + results[4][i].c[0] + " td.monthlyPayments").html(monthlyPayments.toFixed(2));

                  }
                }

                instance.searchRemainingPayments(identificationCode).then(function (results) {
                  console.log ("Remaining Payments!");
                  console.log (results);
                  if (results[0].length != 0) {
                    for (var i=0; i< results[0].length; i++) {
                      console.log (i);
                      try {
                     
                        $("#credit-history tbody tr." + results[1][i].c[0] + " td.remainingPayments").html(results[0][i].c[0]);
                        $("#credit-history tbody tr." + results[1][i].c[0] + " td.interestRate").html(results[2][i].c[0]);

                        var monthlyPayments = parseFloat($("#credit-history tbody tr." + results[1][i].c[0] + " td.monthlyPayments")[0].innerHTML);
                        var remainingPayments = parseFloat($("#credit-history tbody tr." + results[1][i].c[0] + " td.remainingPayments")[0].innerHTML);
                        var creditRating = (monthlyPayments * remainingPayments) / 100000; 

                        console.log ("Credit Rating: ", creditRating);

                        $("#credit-history tbody tr." + results[1][i].c[0] + " td.creditRating").html(creditRating.toFixed(2)); 
                    } catch (e) {

                      console.log ("Exception : ", e);
                    }

                    }
                  }
               });
                
              });

              // Fill Table Rows
              /* for (var i=0; i< results[0].length; i++) {
                instance.bytes32ToString(results[0][i]).then(function(result) {
                  console.log (result);
                  console.log ("i: ", i);
                  $("#credit-history tbody tr." + i + " td.institution").html(result);
                  
                });
              } */ 
              
            }
          
        });
       /*  await instance.searchCreditDetails(identificationCode).then(function (results) {
          console.log ("Credit Details!");
          console.log (results);
          if (results[0].length != 0) {
            for (var i=0; i< results[0].length; i++) {
              console.log (i);
              console.log (results[0][i][0]);
            }
          }
          });
        await instance.bytes32ToString(results[0][i]).then(function(result) {
                  console.log (result);
                  console.log ("i: ", i);
                  $("#credit-history tbody tr." + i + " td.institution").html(result);
                  
                });  */


        }).then(function (result) {
        console.log (result);
        //console.log ("Data: ", data);
      }).catch(function(err) {
        console.error(err);
      });
      // console.log ("Data: ", data);
    }

    
  },

  save: function(event) {


    console.log (event.target.parentElement.parentElement);

    App.contracts.FutureBanking.deployed().then(function(instance) {

      var parent = event.target.parentElement.parentElement;
      var institution = $(".institution img", parent)[0].className;
      var product = $(".product", parent)[0].innerHTML;
      var amount = $(".amount", parent)[0].innerHTML;
      var duration = $(".duration", parent)[0].innerHTML;
      var interest = $(".interest", parent)[0].innerHTML;
      var monthlyPayments = ((amount / duration) + (amount / duration) * (interest / 100))
      console.log (monthlyPayments);

      console.log (institution);

      instance.addCredit (
          $("#SSN").val().trim(), 
          institution, 
          product, 
          Math.floor((Math.random() * 100000) + 1), 
          amount, 
          duration, 
          /*Date.now()*/ 123487329842743,
          /* Date.now() + (2629743 * duration)*/ 123487329842743,
          duration, 
          monthlyPayments,
          interest, 
          100).then(function (result) {
              console.log (result);

      }); 

    });


    // console.log (product, amount, duration, interest);

  },

  recommend: function () {
    var nationalid = $("#SSN").val().trim();
    var amount = parseInt($("#amount").val().trim());
    var income = parseInt($("#income").val().trim());
    var destination = $("#destination").val();
    var duration = $("#duration").val();

    console.log (nationalid, amount, income, destination, duration);

    console.log (products);

    $("#recommended-products tbody")[0].innerHTML = "";

    for (var i=0; i< institutions[destination].length; i++) {
        console.log (institutions[destination][i]);

        var tableCells = "<td class='institution'><img class='"  + institutions[destination][i] + "' src='images/" + institutions[destination][i] + ".png' width='100'></td>";        
        tableCells += "<td class='product'>" + products[destination][institutions[destination][i]] +"</td>";
        tableCells += "<td class='amount'>"+ amount +"</td>";
        tableCells += "<td class='duration'>" + duration +"</td>";
        tableCells += "<td class='interest'>"  + ((Math.random() * 10) + 1).toFixed(2) + "</td>"; 
        tableCells += "<td><button class='btn btn-success notika-btn-success waves-effect' onclick='App.save(event); return false;'>Request</button></td>";
        tableCells = "<tr>" + tableCells + "</tr>";

        $("#recommended-products tbody").append(tableCells);

        console.log (tableCells);
    }

    // var tableCells = "<td class='institution'>"

  },


  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  },

  hexToStr: function(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
      var v = parseInt(hex.substr(i, 2), 16);
      if (v) str += String.fromCharCode(v);
    }

      params = [];
    res = "";
    for (var i=0; i<= str.length; i++){
      if(str.charCodeAt(i) > 31){
        res = res + str[i];
      }
      else{
        params.push(res);
        res = "";
      }
    }
    params.pop();

    return params;
  },

  timeConverter: function (UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  },
 shuffle: function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
