pragma solidity ^0.4.2;

contract FutureBanking {

    // Custom Types
    struct Customer {
        address custAddres;
        bytes32 fullName;
        uint accountsNo;
        bool isValue;
        mapping(uint => Credit) credit;
        
    }


    struct Credit {
        uint account;
        bytes32 financialInstitution;
        bytes32 product;
        uint amount;
        uint duration;
        uint startDate;
        uint endDate;
        uint remainingPayments;
        uint monthlyPayment;
        uint interestRate;
        uint creditScore;
    }


    mapping (bytes32 => Customer) public customers;

    uint public accountID = 1000000;
    uint public customersNo = 0;

    /* ===============================================================================
    Constructor functions
    ================================================================================== */

    function addCustomer (
        bytes32 _nationalID,
        bytes32 _fullName
        ) public {

            if (customers[_nationalID].isValue) {
                // Customer already exists, update values
                customers[_nationalID].fullName = _fullName;

            } else {
                // Debtor does not exist, create
                customers[_nationalID] = Customer(
                    msg.sender,
                    _fullName,
                    0,
                    true
                );

                // Add new debtor
               customersNo++;
            }
        }

    function addCredit (
        bytes32 _nationalID,
        bytes32 _financialInstitution,
        bytes32 _product,
        uint _account,
        uint _amount,
        uint _duration,
        uint _startDate,
        uint _endDate,
        uint _remainingPayments,
        uint _monthlyPayment,
        uint _interestRate,
        uint _creditScore

    ) public {
        // Has customer details
        require (customers[_nationalID].isValue == true); 
        customers[_nationalID].accountsNo++;
        
        uint accountNo = customers[_nationalID].accountsNo;
        
        customers[_nationalID].credit[accountNo] = Credit (
            _account,
            _financialInstitution,
            _product, 
            _amount, 
            _duration,
            _startDate, 
            _endDate,
            _remainingPayments, 
            _monthlyPayment,
            _interestRate,
            _creditScore);
        
    }
    


    /* ====================================================================================================================
        Search
    ======================================================================================================================== */

    function searchCreditFinancialInstitutions(bytes32 _nationalID) public constant 
        returns (bytes32[], bytes32[], uint[]) {

        // Has debtor details
        require (customers[_nationalID].isValue == true); 

        // Variables
        uint recordsNo = customers[_nationalID].accountsNo;
        bytes32[] memory financialInstitutions = new bytes32[](recordsNo + 1);
        bytes32[] memory products = new bytes32[](recordsNo + 1);
        uint[] memory accounts = new uint[](recordsNo + 1);

        // Get Informations Numbers
        for (uint i = 0; i <= recordsNo; i++ ) {
                
                financialInstitutions[i] = customers[_nationalID].credit[i].financialInstitution;
                products[i] = customers[_nationalID].credit[i].product;
                accounts[i] = customers[_nationalID].credit[i].account;
        } 


        return (
            financialInstitutions,
            products,
            accounts
        ); 
        
        // debtors[_identificationCode]
    }


    function searchCreditDetails (bytes32 _nationalID) public constant 
        returns ( uint[], uint[], uint[], uint[], uint[]) {

            // Variables
        uint recordsNo = customers[_nationalID].accountsNo;
        uint[] memory amounts = new uint[](recordsNo + 1);
        uint[] memory duration  = new uint[](recordsNo + 1);
        uint[] memory startDate = new uint[](recordsNo + 1);
        uint[] memory endDate = new uint[](recordsNo + 1); 
        uint[] memory accounts = new uint[](recordsNo + 1);

        // Get Informations Numbers
        for (uint i = 0; i <= recordsNo; i++ ) {
                
                amounts[i] = customers[_nationalID].credit[i].amount;
                duration[i] = customers[_nationalID].credit[i].duration;
                startDate[i] = customers[_nationalID].credit[i].startDate;
                endDate[i] = customers[_nationalID].credit[i].endDate; 
                accounts[i] = customers[_nationalID].credit[i].account;
        } 


        return (
            amounts,
            duration,
            startDate,
            endDate,
            accounts
        ); 


    }

    function searchRemainingPayments (bytes32 _nationalID) public constant 
        returns ( uint[], uint[], uint[]) {

            
        // Has debtor details
        require (customers[_nationalID].isValue == true); 

        // Variables
        uint recordsNo = customers[_nationalID].accountsNo;
        uint[] memory remainingPayments = new uint[](recordsNo + 1); 
        uint[] memory accounts = new uint[](recordsNo + 1);
        uint[] memory interestRate = new uint[](recordsNo + 1);

        // Get Informations Numbers
        for (uint i = 0; i <= recordsNo; i++ ) {
                remainingPayments[i] = customers[_nationalID].credit[i].remainingPayments; 
                accounts[i] = customers[_nationalID].credit[i].account;
                interestRate[i] = customers[_nationalID].credit[i].interestRate;
        } 



        return (
            remainingPayments,
            accounts,
            interestRate
        ); 


    }
    /* ======================================================================================================================
    Utility Functions
    ======================================================================================================================= */

    function bytes32ToString(bytes32 x) public constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }   
}
