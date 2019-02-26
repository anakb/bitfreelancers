pragma solidity ^0.4.21;


/** @title Fabrica de contratos Freelancer. */
contract FreelancerFactory {
    address[] public deployedFreelancers;

    /** @dev Crea contratos Freelancer pasandole "msg.sender", "msg.value" del invocador y argumento recibido "tarea".
      * @param tarea Descripcion de las tareas que ofrece el freelancer.
      */
    function createFreelancer(string tarea) public payable {
        address newFreelancer = (new Freelancer).value(msg.value)(msg.sender, tarea);
        deployedFreelancers.push(newFreelancer);
    }

    /** @dev Devuelve array donde esta fabrica de contratos va guardando todos los contratos que crea.
      * @return a Contenido del array deployedFreelancers.
      */
    function getDeployedFreelancers() public view returns (address[] a) {
        return deployedFreelancers;
    }
}

//https://github.com/jacksonng77/EscrowPurchase/blob/master/purchase.sol
//Slight Modification to run in Remix
//Source: http://solidity.readthedocs.io/en/v0.3.2/solidity-by-example.html#safe-remote-purchase

contract Purchase {
    uint public value;
    address public seller;
    address public buyer;
    enum State { Created, Locked, Inactive }
    State public state;

    // Ensure that `msg.value` is an even number.
    // Division will truncate if it is an odd number.
    // Check via multiplication that it wasn't an odd number.
    constructor() public payable {
        seller = msg.sender;
        value = msg.value / 2;
        require((2 * value) == msg.value);
    }

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer);
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller);
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();

    /// Abort the purchase and reclaim the ether.
    /// Can only be called by the seller before
    /// the contract is locked.
    function abort()
        public
        onlySeller
        inState(State.Created)
    {
        emit Aborted();
        state = State.Inactive;
        seller.transfer(address(this).balance);
    }

    /// Confirm the purchase as buyer.
    /// Transaction has to include `2 * value` ether.
    /// The ether will be locked until confirmReceived
    /// is called.
    function confirmPurchase()
        public
        inState(State.Created)
        condition(msg.value == (2 * value))
        payable
    {
        emit PurchaseConfirmed();
        buyer = msg.sender;
        state = State.Locked;
    }

    /// Confirm that you (the buyer) received the item.
    /// This will release the locked ether.
    function confirmReceived()
        public
        onlyBuyer
        inState(State.Locked)
    {
        emit ItemReceived();
        // It is important to change the state first because
        // otherwise, the contracts called using `send` below
        // can call in again here.
        state = State.Inactive;

        // NOTE: This actually allows both the buyer and the seller to
        // block the refund - the withdraw pattern should be used.

        buyer.transfer(value);
        seller.transfer(address(this).balance);
    }
}

/** @title Contrato Freelancer (hereda de Purchase). */
contract Freelancer is Purchase {

    string public tarea;

    /** @dev Constructor. Toma como argumento una direccion que asigna a su variable seller 
             (modificando asi el comportamiento heredado de Purchase. De esta manera, la
             fabrica consigue pasar el llamador de FreelancerFactory.createFreelancer pues
             si no quedaria como seller en todos los contratos Freelancer creados por la 
             factoria, la direccion del contrato factoria, y no queremos eso).
      * @param _creator Direccion a asignar al campo seller (normalmente usado para que la
             factoria FreelancerFactory haga llegar la direccion del invocador de
             FreelancerFactory.createFreelancer a Freelancer como seller).
      * @param _tarea Descripcion de las tareas que ofrece el freelancer.
      */
    constructor (address _creator, string _tarea) public payable {
        seller = _creator;
        tarea = _tarea;
    }

    /** @dev Getter de todos los campos del contrato en una sola llamada.
      * @return _seller Direccion de cuenta ethereum que ejerce el rol de vendedor en este contrato.
      * @return _buyer Direccion de cuenta ethereum que ejerce el rol de comprador en este contrato.
      * @return _tarea Descripcion de las tareas que ofrece el Freelancer (vendedor) en este contrato.
      * @return _value Precio del servicio que ofrece el Freelancer (vendedor) en este contrato.
      * @return _state Estado del contrato 0=Creado 1=Bloqueado 2=Inactivo.
      */
    function getSummary() public view returns (
      address _seller, address _buyer, string _tarea, uint _value, State _state
      ) {
        return (
          seller,
          buyer,
          tarea,
          value,
          state
        );
    }

    /** @dev Funcion fallback. Se ejecutara cuando se trate de ejecutar una funcion de este contrato
             que no esta definida. Es payable, para poder manejar el msg.value de la transaccion.
             Su comportamiento es revertir la transaccion y asi evitar que lleguen ethers no deseados
             al contrato, excepto si provienen de contratos "suicidas".
      */
    function () public payable { // fallback function // https://ethereum.stackexchange.com/questions/34160/why-do-we-use-revert-in-payable-function
      revert ();
    }
}
