pragma solidity ^0.4.18;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

contract OptionStorage is Ownable {
    
    address public optionFactory;

    struct OptionsData {
        bool expiryStatus;
        uint256 blockNoExpiry;  // Block No.
        address owner;
    } 

    // mapping to track the list of options created by any writer 
    mapping(address => OptionsData) public listOfOptions;
    mapping (bytes32 => uint256) public localUintVariables;
    mapping (bytes32 => address) public localAddressVariables;

    modifier onlyOptionFactory() {
        require(msg.sender == optionFactory);
        _;
    }

    function OptionStorage(address _ownerAddress) public {
        owner = _ownerAddress;
    }

    /////////////////////////
    /// Set Functions
    ////////////////////////

    function setUintValues(bytes32 _name, uint256 _value) public {
        localUintVariables[_name] = _value;
    }

    function setAddressValues(bytes32 _name, address _value) public {
        localAddressVariables[_name] = _value;
    }

    function setOptionFactoryData(bool _status, uint256 _blockTimestamp, address _owner, address _optionAddress) onlyOptionFactory public {
        listOfOptions[_optionAddress] = OptionsData(_status, _blockTimestamp, _owner);
    }

    function setOptionFactoryAddress(address _optionFactory) onlyOwner public {
        optionFactory = _optionFactory;
    }

    ////////////////////////
    /// Get Functions
    ////////////////////////

    function getUintValues(bytes32 _name) public view returns(uint256) {
        return localUintVariables[_name];
    }

    function getAddressValues(bytes32 _name) public view returns(address) {
        return localAddressVariables[_name];
    }


}

library LDerivativeFactory {
    function getOrgAccount(address _storageContract) public view returns(address _orgAccount) {
        return OptionStorage(_storageContract).getAddressValues(keccak256("ORG_ACCOUNT"));
    }

    function getNewOptionFee(address _storageContract) public view returns(uint256 _fee) {
        return OptionStorage(_storageContract).getUintValues(keccak256("fee"));
    }

    function setOptionFactoryData(address _storageContract, bool _status, uint256 _expiry, address _owner, address _optionAddress) public {
        OptionStorage(_storageContract).setOptionFactoryData(_status, _expiry, _owner, _optionAddress);
    }

    function setNewOptionFee(address _storageContract, uint256 _fee) public {
        OptionStorage(_storageContract).setUintValues(keccak256("fee"), _fee);
    }

    function setOrgAddress(address _storageContract, address _orgAddress) public {
        OptionStorage(_storageContract).setAddressValues(keccak256("ORG_ACCOUNT"), _orgAddress);
    }
}

/// ERC Token Standard #20 Interface (https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md)
interface IERC20 {
    function balanceOf(address _owner) public view returns (uint256 balance);
    function transfer(address _to, uint256 _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function approve(address _spender, uint256 _value) public returns (bool success);
    function allowance(address _owner, address _spender) public view returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

interface IOption {

     /**
      * @dev `issueOption` Use to issue option or generate the option called only by the owner of the option
      * @param _assetsOffered No. of options need to be generated
      * @param _premium Amount to be paid by the trader to buy the option
      * @param _expiry Timestamp when option get expired
      */
    function issueOption(uint256 _assetsOffered, uint256 _premium, uint256 _expiry) public;

    /**
     * @dev `incOffering` Use to generate the more option supply in between the time boundation of the option
     * @param _extraOffering No. of options need to generate
     */
    function incOffering(uint256 _extraOffering) public;

    /**
     * @dev `tradeOption` This function use to buy the option
     * @param _trader Address of the buyer who buy the option
     * @param _amount No. of option trader buy
     * @return bool
     */
    function tradeOption(address _trader, uint256 _amount) external returns (bool);
    
     /**
     * @dev `exerciseOption` This function use to excercise the option means to sell the option to the owner again
     * @param _amount no. of option trader want to exercise
     * @return bool
     */
    function exerciseOption(uint256 _amount) external returns (bool);

    /**
     * @dev `withdrawTokens` Withdraw the tokens
     * @return bool
     */
    function withdrawTokens() external returns(bool);

    /** 
     * @dev send `_value` token to `_to` from `msg.sender`
     * @param _to The address of the recipient
     * @param _value The amount of token to be transferred
     * @return Whether the transfer was successful or not 
    */
    function transfer(address _to, uint256 _value) public returns (bool);

    /** 
     * @dev send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value The amount of token to be transferred
     * @return Whether the transfer was successful or not 
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool);

    /**
     * @dev `balanceOf` function used to read the balance of the token holder
     * @param _owner The address from which the balance will be retrieved
     * @return The balance 
     */
    function balanceOf(address _owner) public view returns (uint256 balance);

    /** 
     * @dev `msg.sender` approves `_spender` to spend `_value` tokens
     * @param _spender The address of the account able to transfer the tokens
     * @param _value The amount of tokens to be approved for transfer
     * @return Whether the approval was successful or not 
     */
    function approve(address _spender, uint256 _value) public returns (bool);

    /** 
     * @dev `allowance`
     * @param _owner The address of the account owning tokens
     * @param _spender The address of the account able to transfer the tokens
     * @return Amount of remaining tokens allowed to spent 
     */
    function allowance(address _owner, address _spender) public view returns (uint256 remaining);

}

/// @title Math operations with safety checks
library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }

    function max64(uint64 a, uint64 b) internal pure returns (uint64) {
        return a >= b ? a : b;
    }

    function min64(uint64 a, uint64 b) internal pure returns (uint64) {
        return a < b ? a : b;
    }

    function max256(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    function min256(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}

interface IProxy {

    /**
     * @dev `distributeStakes` Use to settle down the excersice request of the option
     * @param _to Address of the seller
     * @param _amount Number of the assets seller want to excercised
     * @return bool success
     */
    function distributeStakes(address _to, uint256 _amount) public returns (bool success);

    /**
     * @dev withdraw the unused base token and quote token only by owner
     * @return bool success    
     */
    function withdrawal() public returns (bool success);
}

contract Proxy is IProxy {

    IERC20 public BT;
    IERC20 public QT;

    address public option;
    address public buyer;
    uint256 public optionsExpiry;
    uint256 public strikePrice;

    modifier onlyOption() {
        require(msg.sender == option);
        _;
    }

    /**
     * @dev Constructor
     * @param _baseToken Address of the Base token
     * @param _quoteToken Address of the Quote token
     * @param _expiry Unix timestamp to expire the option
     * @param _strikePrice Price at which buyer will obligate to buy the base token
     * @param _buyer Address of the buyer
     */
    function Proxy(address _baseToken, address _quoteToken, uint256 _expiry, uint256 _strikePrice, address _buyer) public {
        option = msg.sender;
        BT = IERC20(_baseToken);
        QT = IERC20(_quoteToken); 
        optionsExpiry = _expiry;
        strikePrice = _strikePrice;
        buyer = _buyer;
    }

    /**
     * @dev `distributeStakes` Use to settle down the excersice request of the option
     * @param _to Address of the seller
     * @param _amount Number of the assets seller want to excercised
     * @return bool success
     */
    function distributeStakes(address _to, uint256 _amount) onlyOption public returns (bool success) {
        require(msg.sender == option);
        require(QT.transfer(_to, _amount * strikePrice));
        require(BT.transferFrom(_to, buyer, _amount));
        return true; 
    } 

    /**
     * @dev withdraw the unused base token and quote token only by owner
     * @return bool success    
     */
    function withdrawal() onlyOption public returns (bool success) {
        require(msg.sender == option);
        require(block.number > optionsExpiry);
        uint256 balanceBT = BT.balanceOf(this);
        uint256 balanceQT = QT.balanceOf(this);
        require(BT.transfer(buyer, balanceBT));
        require(QT.transfer(buyer, balanceQT));
        return true;
    }

}

contract Option is IOption {

    using SafeMath for uint256;

    IERC20 public BT;
    IERC20 public QT;
    IProxy public proxy;
    address public tokenProxy;

    address public buyer;
    address public baseToken;
    address public quoteToken;
    uint256 public strikePrice;
    uint256 public expirationDate;

    uint256 public assetsOffered;
    uint256 public premium;
    uint256 public expiry;
    bool public isOptionIssued = false;

    uint8 public decimals = 0;
    uint8 public constant DECIMAL_FACTOR = 18;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    // Notifications
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event LogOptionsIssued(uint256 _optionsIssued, uint256 _expirationTime, uint256 _premium, address _tokenProxy);
    event LogOptionsTrade(address indexed _trader, uint256 _amount, uint256 _timestamp);
    event LogOptionsExcercised(address indexed _trader, uint256 _amount, uint256 _timestamp);

    struct traderData {
        uint256 optionQuantity;
        bool status;                        // false when it doesn't excercise the full option Quantity, True when fully excercised 
    }

    mapping(address => traderData) public Traders;

    modifier onlyBuyer() {
        require(msg.sender == buyer);
        _;
    }
    
    /**
     * @dev `Option` Constructor
     */

    function Option( 
        address _baseToken, 
        address _quoteToken, 
        uint256 _strikePrice,
        uint256 _expirationDate,
        address _buyer
        ) public 
    {
        require(_buyer != address(0) && _quoteToken != address(0) && _baseToken != address(0));
        require(_expirationDate > now);
        require(_strikePrice > 0);
        buyer = _buyer;
        baseToken = _baseToken;
        quoteToken = _quoteToken;
        strikePrice = _strikePrice;
        expirationDate = _expirationDate;
        BT = IERC20(baseToken);
        QT = IERC20(quoteToken);
    }

    /**
     * @dev `issueOption` Use to issue option or generate the option called only by the owner of the option
     * @param _assetsOffered No. of options need to be generated
     * @param _premium Amount to be paid by the trader to buy the option
     * @param _expiry Timestamp when option get expired
     */
    function issueOption(uint256 _assetsOffered, uint256 _premium, uint256 _expiry) public {
        require(isOptionIssued == false);
        require(msg.sender == buyer);
        require(_premium > 0);
        require(expirationDate >= now);
        require(_expiry > block.number);
        tokenProxy = new Proxy(baseToken, quoteToken, _expiry, strikePrice, buyer);
        proxy = IProxy(tokenProxy);
        // Allowance for the option contract is necessary allowed[buyer][this] = _optionsOffered
        uint256 assets = _assetsOffered * strikePrice * 10 ** uint256(DECIMAL_FACTOR);
        require(QT.transferFrom(buyer, tokenProxy, assets)); 
        balances[this] = _assetsOffered;
        assetsOffered = _assetsOffered;
        premium = _premium;
        expiry = _expiry;
        isOptionIssued = !isOptionIssued;
        Transfer(0x0, this, _assetsOffered);
        LogOptionsIssued(_assetsOffered, expiry, premium, tokenProxy);
    }


    /**
     * @dev `incOffering` Use to generate the more option supply in between the time boundation of the option
     * @param _extraOffering No. of options need to generate
     */
    function incOffering(uint256 _extraOffering) public {
        require(msg.sender == buyer);
        require(expiry > now);
        // Allowance for the option contract is necessary allowed[buyer][this] = _extraOffering
        uint256 extraOffering = _extraOffering * strikePrice * 10 ** uint256(DECIMAL_FACTOR);
        require(QT.transferFrom(buyer, tokenProxy, extraOffering));
        assetsOffered = assetsOffered.add(_extraOffering);
        balances[this] = balances[this].add(_extraOffering);
        Transfer(0x0, this, _extraOffering);
        LogOptionsIssued(assetsOffered, expiry, premium, tokenProxy);
    }

    /**
     * @dev `tradeOption` This function use to buy the option
     * @param _trader Address of the buyer who buy the option
     * @param _amount No. of option trader buy
     * @return bool
     */
    function tradeOption(address _trader, uint256 _amount) external returns(bool) {
        require(_amount > 0);
        require(_trader != address(0));
        require(expiry > block.number);
        uint256 amount = _amount * premium * 10 ** uint256(DECIMAL_FACTOR);
        require(QT.transferFrom(_trader, tokenProxy, amount));
        require(this.transfer(_trader,_amount));
        Traders[_trader] = traderData(_amount,false);
        LogOptionsTrade(_trader, _amount, now);
        return true;
    }
    
    event LogA(uint256 _amount);
    /**
     * @dev `exerciseOption` This function use to excercise the option means to sell the option to the owner again
     * @param _amount no. of option trader want to exercise
     * @return bool
     */
    function exerciseOption(uint256 _amount) external returns (bool) {
        require(_amount > 0);
        require(expiry >= block.number);      
        require(this.balanceOf(msg.sender) >= _amount);
        uint256 amount = _amount * 10 ** uint256(DECIMAL_FACTOR);
        LogA(amount);
        require(proxy.distributeStakes(msg.sender, amount));
        // Provide allowance to this by the trader
        require(this.transferFrom(msg.sender, 0x0, _amount)); 
        Traders[msg.sender].optionQuantity = Traders[msg.sender].optionQuantity.sub(_amount);
        LogOptionsExcercised(msg.sender, _amount, now);
        return true;
    }

    /**
     * @dev `withdrawTokens` Withdraw the tokens
     * @return bool
     */
    function withdrawTokens() onlyBuyer external returns(bool) {
        require(proxy.withdrawal());
        return true;
    }

    ///////////////////////////////////
    //// Get Functions
    //////////////////////////////////

    function getOptionDetails() view public returns (address, address, address, address, uint256, uint256, uint256, uint256) {
        return (
            buyer,
            baseToken,
            quoteToken,
            tokenProxy,
            strikePrice,
            expiry,
            premium,
            assetsOffered
        );
    } 

    //////////////////////////////////
    ////// ERC20 functions
    /////////////////////////////////

     /** 
      * @dev send `_value` token to `_to` from `msg.sender`
      * @param _to The address of the recipient
      * @param _value The amount of token to be transferred
      * @return Whether the transfer was successful or not 
      */
    function transfer(address _to, uint256 _value) public returns (bool) {
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(msg.sender, _to, _value);
        return true;
    }

    /** 
     * @dev send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value The amount of token to be transferred
     * @return Whether the transfer was successful or not 
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
      require(_to != address(0));
      require(_value <= balances[_from]);
      require(_value <= allowed[_from][msg.sender]);

      balances[_from] = balances[_from].sub(_value);
      balances[_to] = balances[_to].add(_value);
      allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
      Transfer(_from, _to, _value);
      return true;
    }

    /**
     * @dev `balanceOf` function used to read the balance of the token holder
     * @param _owner The address from which the balance will be retrieved
     * @return The balance 
     */
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    /** 
     * @dev `msg.sender` approves `_spender` to spend `_value` tokens
     * @param _spender The address of the account able to transfer the tokens
     * @param _value The amount of tokens to be approved for transfer
     * @return Whether the approval was successful or not 
     */
    function approve(address _spender, uint256 _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    /** 
     * @dev `allowance`
     * @param _owner The address of the account owning tokens
     * @param _spender The address of the account able to transfer the tokens
     * @return Amount of remaining tokens allowed to spent 
     */
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }


}

/**
 * @notice  Governanace of this contract need to be decided whether it be operated by the single wandx entity
            or it will be more decentralized by adding the vote scheme for the changes in the operator contract
 */






contract DerivativeFactory is Ownable {

    using LDerivativeFactory for address;
    string public version = "0.1";
    address DT_Store;
    IERC20 WAND;

    // Notifications
    event OptionCreated(address _baseToken, address _quoteToken, uint256 _blockTimestamp, address _optionAddress, address indexed _creator);

    /**
     * @dev Constructor
     * @param _storageAddress Address of the storage contract
     * @param _tokenAddress Address of the token which used as the transaction fee    
     */
    function DerivativeFactory(address _storageAddress, address _tokenAddress) public {
       DT_Store = _storageAddress;
       WAND = IERC20(_tokenAddress);
       DT_Store.setNewOptionFee(100 * 10 ** 18);
       owner = msg.sender;
    }

    /**
     * @dev Function use to create the new option contract
     * @param _baseToken Address of the Base token
     * @param _quoteToken Address of the Quote token
     * @param _strikePrice Price at which buyer will obligate to buy the base token
     * @param _blockTimestamp Unix timestamp to expire the option
     * @return bool
     */
    function createNewOption(address _baseToken, address _quoteToken, uint256 _strikePrice, uint256 _blockTimestamp) 
    external 
    returns (bool) 
    {   
        address orgAccount = DT_Store.getOrgAccount();
        uint256 _fee = DT_Store.getNewOptionFee();
        // Before creation creator should have to pay the service fee to wandx Platform
        require(WAND.transferFrom(msg.sender, orgAccount, _fee));
        address _optionAddress = new Option(_baseToken, _quoteToken, _strikePrice, _blockTimestamp, msg.sender);    
        DT_Store.setOptionFactoryData(false, _blockTimestamp, msg.sender, _optionAddress);
        OptionCreated(_baseToken, _quoteToken, _blockTimestamp, _optionAddress, msg.sender);
        return true;
    }

    function changeNewOptionFee(uint256 _newFee) onlyOwner public {
        DT_Store.setNewOptionFee(_newFee);
    }

    function setOrgAccount(address _orgAddress) onlyOwner public {
        DT_Store.setOrgAddress(_orgAddress);
    }

    function getOrgAccount() public view returns(address) {
        return DT_Store.getOrgAccount();
    }

    function getOptionFee() public view returns(uint256) {
        return DT_Store.getNewOptionFee();
    }

}