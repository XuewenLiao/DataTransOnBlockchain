pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;
// import "strings.sol";


contract QodReward {
    
    // using strings for *;
    
    struct DataProvider {
    address payable providerAddress;
    string[] ipfsDataHash;
    string aesKey;
    string qodScore;
    uint pmoney;
    uint qodVote;  //对qod验证结果进行投票--0：不同意；1：同意
    uint rewardVote;  //对reward分配金额进行投票--0：不同意；1：同意
    mapping(address => OtherDataProvider) otherDataProvider;
    address[] otherProAddressArry;
    }

    struct OtherDataProvider {
        string qodScore;
        uint pmoney;
    }

    struct DataConsumer {
        address payable consumerAddress;
        string ipfsAESPublicKey;
    }

    mapping(address => DataProvider) public dataProviders;
    address payable[] dataProviderAddresses;
    mapping(address => string) qodOfProvider; // 存将所有provider的qod，供consumer查看后决定奖金额数目
    mapping(address => uint) moneyOfProvider;
    address[] otherProAddress;  //存除调用者以外其他的provider地址

    uint totalMoney = 0;
    
    DataConsumer public dataConsumer;

    event SaveIpfs(string[] ipfsDataHashArry,address proAddress,bool isSaveSuccess);
    event SaveQod(address proAddress,string score,bool isSelf);
    event PublishMoney(uint tMoney);
    event CalcuRewardByProvider(address proAddress,uint money,bool isSelf);
    event CalcuRewardByConsumer(address proAddress,uint money);
    event ProviderVerifiedReward(address proAddress,uint rewardVote,bool isAgree);
    
    modifier etherProvided() {
        require(msg.value > 0, "Need ether to be greater than 0");
        _;
    }
    
    /// Create a new contract
    constructor(string memory _aesPublicKey) public {
        dataConsumer = DataConsumer({
            consumerAddress : msg.sender,
            ipfsAESPublicKey : _aesPublicKey
            });
    }
    
    //1、注册数据提供者到智能合约: 暂存ipfsHash --让hash和消费者以映射形式暂存
    function registerAsProvider (string[] memory ipfsDataHashArry,address proAddress) public {
    
        bool isSaveSuccess = false;
        if (ipfsDataHashArry.length != 0 && proAddress != address(0x0)) {
            dataProviders[proAddress].ipfsDataHash = ipfsDataHashArry;
            dataProviders[proAddress].qodVote = 0; //初始化provider为不同意
            dataProviders[proAddress].rewardVote = 0;
            dataProviderAddresses.push(msg.sender);
            isSaveSuccess = true;
        }else{
            isSaveSuccess = false;
        }

        emit SaveIpfs(ipfsDataHashArry,proAddress,isSaveSuccess);
        
       
    }
    
    //2、下载实际数据: 将1中存储的ipfsHash取出取出取出fanhuigeifuwuqi取出取出返回给服务器
    function getIPFSData (address proAddress) public returns (string[] memory ipfsHashArry) {
        if (proAddress == msg.sender){
            ipfsHashArry = dataProviders[proAddress].ipfsDataHash;
            return ipfsHashArry; 
        }
    }
    
    // //3、公布AES密钥：暂存AES—可用于验证数据、和后面被加密
    // function publishAESKey (address proAddress,string memory aesKey) public returns (bool isSuccess) {
    //     if (proAddress == msg.sender){
    //         dataProviders[proAddress].aesKey = aesKey;
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }
    
    // //3.1: 获取AESKey
    // function getAESKey (address proAddress) public returns(string memory theAesKey){
    //     theAesKey = dataProviders[proAddress].aesKey;
    //     return theAesKey;
    // }
    
    //4、计算qod：将服务器计算的qod暂存起来
    function calcuQod(address proAddress,string memory score) public {
        bool isSelf = false;
        
        if (proAddress == msg.sender) {
            dataProviders[proAddress].qodScore = score;
            isSelf = true;
        }else{
            dataProviders[msg.sender].otherDataProvider[proAddress].qodScore = score;
            dataProviders[msg.sender].otherProAddressArry.push(proAddress);
            isSelf = false;
        }

        emit SaveQod(proAddress,score,isSelf);
        
    }
    
    // //5、验证qod数据：验证自己算的其他provider的qod是否和那些provider自己算的一致。
    // //若成功，返回自身地址；若失败，返回验证失败的第一个地址。
      
    // function verifiedData() public returns (bool isVerifiedSuccess,string memory allFailProAddress) {
        
    //     uint otherProviderSum = dataProviders[msg.sender].otherProAddressArry.length;
    //     otherProAddress = dataProviders[msg.sender].otherProAddressArry;
    //     for (uint i = 0;i < otherProviderSum;i++) {
    //         if (keccak256(abi.encodePacked(dataProviders[msg.sender].otherDataProvider[otherProAddress[i]].qodScore)) == 
    //             keccak256(abi.encodePacked(dataProviders[otherProAddress[i]].qodScore))) {
    //             continue;
    //         }else{
    //             // string memory failProAddress = addressToString(otherProAddress[i]);
    //             allFailProAddress = addressToString(otherProAddress[i]).toSlice().concat("+".toSlice());
    //             dataProviders[msg.sender].qodVote = 0; //验证不通过则本provider的vote为0
    //             return (false,allFailProAddress);
    //         }
    //     }
    //     dataProviders[msg.sender].qodVote = 1; //验证通过则本provider的vote为1
    //     return (true,addressToString(msg.sender));
    // }
    
    // //6、统计同意票数（公共方法：任何人可调用，相当于将投票结果全网公布）
    // function agree() public returns (bool isAllAgree){
    //     uint proLen = dataProviderAddresses.length;
    //     uint sum = 0;
    //     for(uint i = 0;i < proLen;i++) {
    //         if (dataProviders[dataProviderAddresses[i]].qodVote == 1 ) {
    //             sum = sum + 1;
    //         }
    //     }
        
    //     //若同意票数为总provider数目
    //     if (sum == proLen) {
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }
    
    // //7、Consumer获得数据qod；公布奖金额
    // //7.1 获取provider的qod
    // function getProviderQod(address proAddress) public returns (string memory qod) {
    //     qod = dataProviders[proAddress].qodScore;
    //     return qod;
    // }
    
    //7.2 公布奖金
    function publishTotalMoney(uint tMoney) public {
        totalMoney = tMoney;
        emit PublishMoney(tMoney);
    }
    
    // //8、计算激励金额
    // //8.1.1 provider函数:查在网络中公布的总金额
    // function getTotalMoney() public returns (uint tMoney) {
    //     return totalMoney;
    // }

    //8.1.2 provider函数:计算自己和其他人的奖金额
    function calcuRewardByProvider(address proAddress,uint money) public {
        bool isSelf = false;
        if (proAddress == msg.sender) {
            dataProviders[proAddress].pmoney = money;
            isSelf = true;
        }else{
            dataProviders[msg.sender].otherDataProvider[proAddress].pmoney = money;
            isSelf = false;
        }
        emit CalcuRewardByProvider(proAddress,money,isSelf);
    }
    
    //8.2 consumer函数：计算每个provider的奖金额
    function calcuRewardByConsumer(address proAddress,uint money) public {
        moneyOfProvider[proAddress] = money;
        emit CalcuRewardByConsumer(proAddress,money);
    }
    
    // //9、验证激励金额
    // //9.1 provider函数
    // // function providerVerifiedReward() public returns (bool isVerifiedSuccess) {
        
    // //     uint otherProviderSum = dataProviders[msg.sender].otherProAddressArry.length;
    // //     otherProAddress = dataProviders[msg.sender].otherProAddressArry;
    // //     for (uint i = 0;i < otherProviderSum;i++) {
    // //         if (keccak256(abi.encodePacked(dataProviders[msg.sender].otherDataProvider[otherProAddress[i]].pmoney)) == 
    // //             keccak256(abi.encodePacked(dataProviders[otherProAddress[i]].pmoney)) && 
    // //             keccak256(abi.encodePacked(dataProviders[msg.sender].otherDataProvider[otherProAddress[i]].pmoney)) == 
    // //             keccak256(abi.encodePacked(moneyOfProvider[otherProAddress[i]])) && 
    // //             keccak256(abi.encodePacked(dataProviders[msg.sender].pmoney)) == 
    // //             keccak256(abi.encodePacked(moneyOfProvider[msg.sender]))) {
                    
    // //             continue;
    // //         }else{
    // //             dataProviders[msg.sender].rewardVote = 0;
    // //             return false;
    // //         }
    // //     }
    // //     dataProviders[msg.sender].rewardVote = 1;
    // //     return true;
    // // }
    
     function providerVerifiedReward() public {
        bool isAgree = true;

        uint otherProviderSum = dataProviders[msg.sender].otherProAddressArry.length;
        otherProAddress = dataProviders[msg.sender].otherProAddressArry;
        for (uint i = 0;i < otherProviderSum;i++) {
            if (keccak256(abi.encodePacked(dataProviders[msg.sender].otherDataProvider[otherProAddress[i]].pmoney)) == 
                keccak256(abi.encodePacked(dataProviders[otherProAddress[i]].pmoney)) && 
                keccak256(abi.encodePacked(dataProviders[msg.sender].otherDataProvider[otherProAddress[i]].pmoney)) == 
                keccak256(abi.encodePacked(moneyOfProvider[otherProAddress[i]])) && 
                keccak256(abi.encodePacked(dataProviders[msg.sender].pmoney)) == 
                keccak256(abi.encodePacked(moneyOfProvider[msg.sender]))) {
                dataProviders[msg.sender].rewardVote = 1;    
                continue;
            }else{
                // allFailProAddress = addressToString(otherProAddress[i]).toSlice().concat("+".toSlice());
                dataProviders[msg.sender].rewardVote = 0;
                isAgree = false;
                break;
            }
            
        }
        
        emit ProviderVerifiedReward(msg.sender,dataProviders[msg.sender].rewardVote,isAgree);
    }
    
    
    // //9.2 consumer函数
    // // function consumerVerifiedReward() public returns (bool isVerifiedSuccess,address failProAddress) {
    // //     uint proLen = dataProviderAddresses.length;
    // //     for (uint i = 0;i < proLen;i++) {
    // //         if (moneyOfProvider[dataProviderAddresses[i]] == dataProviders[dataProviderAddresses[i]].pmoney) {
    // //             continue;
    // //         }else{
    // //             failProAddress = dataProviderAddresses[i];
    // //             return (false,failProAddress);
    // //         }
    // //     }
    // //     return (true,msg.sender);
    // // }
    
    
    //  function consumerVerifiedReward() public returns (bool isVerifiedSuccess,string memory allFailProAddress) {
    //     uint proLen = dataProviderAddresses.length;
    //     for (uint i = 0;i < proLen;i++) {
    //         if (moneyOfProvider[dataProviderAddresses[i]] == dataProviders[dataProviderAddresses[i]].pmoney) {
    //             continue;
    //         }else{
    //             // failProAddress = dataProviderAddresses[i];
    //             allFailProAddress = addressToString(otherProAddress[i]).toSlice().concat("+".toSlice());
    //             return (false,allFailProAddress);
    //         }
    //     }
    //     return (true,addressToString(msg.sender));
    // }
    
    
    // //10、数据提供者投票表决是否接受目前的激励金额(已在9.1中实现)
    
    // //11、统计票数（内部函数）
    // function isAcceptReward() internal returns (bool isAccept) {
    //     uint proLen = dataProviderAddresses.length;
    //     uint sum = 0;
    //     for(uint i = 0;i < proLen;i++) {
    //         if (dataProviders[dataProviderAddresses[i]].rewardVote == 1 ) {
    //             sum = sum + 1;
    //         }
    //     }
        
    //     if (proLen % 2 == 0){  //总人数为偶数
    //         if (sum > proLen/2) {   //超过50%同意
    //             return true;
    //         }else{
    //             return false;
    //         }
    //     }else{  //总人数为奇数
    //         if (sum >= (proLen+2-1)/2) {    //超过50%同意
    //             return true;
    //         }else{
    //             return false;
    //         }
    //     }
        
    // }
    
    // //12、发放资金
    // //解释：理论上这一步应该内部先发起验证、再统计票数（中途拒绝支付gas说明对结果表示不同意）
    // function transferMoney() public returns (string memory result) {
    //     if (isAcceptReward() == true){
    //          uint balance = address(this).balance;
    //          uint proLen = dataProviderAddresses.length;
    //         for (uint i = 0; i < proLen; i++) {
    //             address payable _providerAddress = dataProviderAddresses[i];
    //             _providerAddress.transfer(balance * dataProviders[_providerAddress].pmoney);
    //         }
    //         return "交易成功";
    //     }else{
    //         return "分配金额未达成一致";
    //     }
    // }
    
    
    
    
    // //Tool: address change to string
    // function addressToString(address x) public returns (string memory s) {
    //     bytes memory b = new bytes(20);
    //     for (uint i = 0; i < 20; i++)
    //         b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    //     return string(b);
    // }
    
}