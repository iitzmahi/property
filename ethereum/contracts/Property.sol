pragma solidity ^0.4.17;
contract FactoryRent 
{
    address[] public rentDeployed;
    mapping(address=>address[]) managerContractList;
    mapping(address=>bool) managerList;
    uint public totalContracts;
    function FactoryRent() public 
    {
        totalContracts = 0;
    }
    function createRent(uint security,string name,string desc,string propertyLocation,uint rentPerMonth,uint lateRentCharges) public 
    {
        address newRentContract = new Rent(security,name,desc,propertyLocation,rentPerMonth,msg.sender,lateRentCharges);
        rentDeployed.push(newRentContract);
        managerContractList[msg.sender].push(newRentContract);
        totalContracts++;
        managerList[msg.sender] = true;
    }
    function getDeployedRentContract() public view returns(address[]) 
    {
        return rentDeployed;
    }
    function searchManager(address manager) public view returns(bool)
    {
        return managerList[manager];
    }
    function getManagerContracts(address mngr) public view returns(address[])
    {
        return managerContractList[mngr];
    }
}
contract Rent
{
    struct MonthlyRent {
        string startDate;
        string endDate;
        uint paid;
        uint lateCharges;
        uint timestamp;
        string dateOfPayment;
    }
    address public manager; // who deployed this contract
    string name;    // property type name
    string propertyLocation; // Location of the property
    uint public rentPerMonth; //Monthly rent
    uint public security;   // security money
    uint public lessorSecurity;// security money from lessor
    uint public lesseeSecurity;// security money from lessee
    uint recurringDate;// Date of the month for rent payment
    int public availability;//-1:maintenance 0:rented 1:available
    string public description; // full description about property
    bool public securityRequest;
    address[] public pastRenters;// list of people who rented this property
    uint public lateRentCharges;
    int public rating;//rating of the particular property initially set -1;
    MonthlyRent[] public monthlyRents;
    uint public endDate;
    // restrict permissions only manager can access
    modifier restricted() {
    require(msg.sender == manager);
    _;
    }
    // constructor to set initial properties
    function Rent(uint _security,string _name,string _description,string _propertyLocation,uint _rentPerMonth,address creator,uint _lateRentCharges) public
    {
        security = _security;
        propertyLocation = _propertyLocation;
        name = _name;
        manager = creator;
        description = _description;
        availability = -1;
        rating = -1;
        rentPerMonth = _rentPerMonth;
        securityRequest = false;
        lateRentCharges = _lateRentCharges;
        recurringDate = 0;
        endDate = 0;
    }
    //method used to take initial security amount from the property owner
    function payInitialAmount() public restricted payable
    {
        require(msg.value >= security);
        require(availability == -1);
        availability = 1;
    }
    function paySecurityLessee(uint currentDate) public payable
    {
        require(availability == 1);
        lesseeSecurity = msg.value;
        pastRenters.push(msg.sender);
        availability = 0;
        recurringDate = currentDate;
    }
    function payRent(uint numDays,uint index,string paymentDate) public payable
    {
        uint lateCharges = numDays*lateRentCharges;
        require(msg.value >= rentPerMonth);
        require(availability == 0);
        require(msg.sender == pastRenters[(pastRenters.length)-1]);
        require(lesseeSecurity >= lateCharges);
        manager.transfer(msg.value+lateCharges);
        lesseeSecurity -= lateCharges;
        MonthlyRent storage mr = monthlyRents[index];
        mr.paid = 1;
        mr.lateCharges = lateCharges;
        mr.dateOfPayment = paymentDate;
    }
    // manager can edit details regarding the property
    function editDetails(string newname,uint newsecurity,string newDescription,uint newRentPerMonth) public restricted
    {
        name = newname;
        security = newsecurity;
        description = newDescription;
        rentPerMonth = newRentPerMonth;
    }

    function returnSecurity() public restricted
    {
        require(securityRequest == true);
        pastRenters[pastRenters.length-1].transfer(lesseeSecurity);
        msg.sender.transfer(this.balance);
        availability = -1;
        securityRequest = false;
    }
    function requestSecurity() public 
    {
        require(msg.sender == pastRenters[pastRenters.length-1]);
        securityRequest = true;
    }
    //get the person currently leasing the property
    function getCurrentLessee() public view returns(address)
    {
        uint len = pastRenters.length;
        if(len == 0 || availability == 1)
        {
            return 0;
        }
        else
        {
            return pastRenters[len-1];
        }
    }
    function getMonthlyRentsSize() public view returns(uint)
    {
        return monthlyRents.length;
    }
    function takeOnMaintenance() public restricted
    {
        require(availability == 1);
        availability = -1;
        msg.sender.transfer(this.balance);
    }
    function askForRent(string _startDate,string _endDate,uint startDateInSecs,uint endDateInSecs) public restricted
    {
        MonthlyRent memory newMonthlyRent = MonthlyRent({
            startDate: _startDate,
            endDate: _endDate,
            paid: 0,
            lateCharges:0,
            timestamp: startDateInSecs,
            dateOfPayment: ""
        });
        monthlyRents.push(newMonthlyRent);
        endDate = endDateInSecs;
    }
    // to get all details about contract
    function RentSummary() public view returns (address, uint, int, string, int, uint,string,uint,string) 
    {
        return (
        manager,
        security,
        availability,
        description,
        rating,
        rentPerMonth,
        name,
        lateRentCharges,
        propertyLocation
        );
    }
}