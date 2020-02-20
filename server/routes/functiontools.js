var data = [
    { "uaddress": "0x276ea10526355d106a1abb3853b41aa9adc9af54", "datadate": "2019-05-09 09:10:00", "dataplace": "p1", "datacontent": { "placedata": 63, "collectdata": 75 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0x33d8de600a16d3e417eb807729f74207156d3b8a", "datadate": "2019-05-09 09:10:00", "dataplace": "p1", "datacontent": { "placedata": 63, "collectdata": 63 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0xc1d7f6b541800b10b2e7c4f686ae97f89bbed80e", "datadate": "2019-05-09 09:10:00", "dataplace": "p1", "datacontent": { "placedata": 63, "collectdata": 80 }, "ipfsdatahash": "", "hassell": false },
    { "uaddress": "0x276ea10526355d106a1abb3853b41aa9adc9af54", "datadate": "2019-05-09 09:15:00", "dataplace": "p2", "datacontent": { "placedata": 64, "collectdata": 73 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0x33d8de600a16d3e417eb807729f74207156d3b8a", "datadate": "2019-05-09 09:15:00", "dataplace": "p2", "datacontent": { "placedata": 64, "collectdata": 63 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0xc1d7f6b541800b10b2e7c4f686ae97f89bbed80e", "datadate": "2019-05-09 09:15:00", "dataplace": "p2", "datacontent": { "placedata": 64, "collectdata": 82 }, "ipfsdatahash": "", "hassell": false },
    { "uaddress": "0x276ea10526355d106a1abb3853b41aa9adc9af54", "datadate": "2019-05-09 09:20:00", "dataplace": "p3", "datacontent": { "placedata": 62, "collectdata": 72 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0x33d8de600a16d3e417eb807729f74207156d3b8a", "datadate": "2019-05-09 09:20:00", "dataplace": "p3", "datacontent": { "placedata": 62, "collectdata": 63 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0xc1d7f6b541800b10b2e7c4f686ae97f89bbed80e", "datadate": "2019-05-09 09:20:00", "dataplace": "p3", "datacontent": { "placedata": 62, "collectdata": 78 }, "ipfsdatahash": "", "hassell": false },
    { "uaddress": "0x276ea10526355d106a1abb3853b41aa9adc9af54", "datadate": "2019-05-09 09:25:00", "dataplace": "p4", "datacontent": { "placedata": 64, "collectdata": 72 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0x33d8de600a16d3e417eb807729f74207156d3b8a", "datadate": "2019-05-09 09:25:00", "dataplace": "p4", "datacontent": { "placedata": 64, "collectdata": 63 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0xc1d7f6b541800b10b2e7c4f686ae97f89bbed80e", "datadate": "2019-05-09 09:25:00", "dataplace": "p4", "datacontent": { "placedata": 64, "collectdata": 80 }, "ipfsdatahash": "", "hassell": false },
    { "uaddress": "0x276ea10526355d106a1abb3853b41aa9adc9af54", "datadate": "2019-05-09 09:30:00", "dataplace": "p5", "datacontent": { "placedata": 65, "collectdata": 72 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0x33d8de600a16d3e417eb807729f74207156d3b8a", "datadate": "2019-05-09 09:30:00", "dataplace": "p5", "datacontent": { "placedata": 65, "collectdata": 60 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0xc1d7f6b541800b10b2e7c4f686ae97f89bbed80e", "datadate": "2019-05-09 09:30:00", "dataplace": "p5", "datacontent": { "placedata": 65, "collectdata": 81 }, "ipfsdatahash": "", "hassell": false },
    { "uaddress": "0x276ea10526355d106a1abb3853b41aa9adc9af54", "datadate": "2019-05-09 09:35:00", "dataplace": "p6", "datacontent": { "placedata": 66, "collectdata": 72 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0x33d8de600a16d3e417eb807729f74207156d3b8a", "datadate": "2019-05-09 09:35:00", "dataplace": "p6", "datacontent": { "placedata": 66, "collectdata": 60 }, "ipfsdatahash": "", "hassell": false }, { "uaddress": "0xc1d7f6b541800b10b2e7c4f686ae97f89bbed80e", "datadate": "2019-05-09 09:35:00", "dataplace": "p6", "datacontent": { "placedata": 66, "collectdata": 80 }, "ipfsdatahash": "", "hassell": false }
];

function calcuQod(alldata) {
    var wtopSummary = []    //人-->采集点集合
    var ptowSummary = []    //采集点-->人的集合

    //一、算bj
    bjArray = calcuBj(alldata,wtopSummary)
    console.log('bjArray==', JSON.stringify(bjArray))
    //二、算每个点的真实值ui
    uiArray = calcuUi(alldata, ptowSummary ,bjArray)
    console.log('uiArray==', JSON.stringify(uiArray))

    //三、计算Qod
    qodArray = getQod(ptowSummary,uiArray)
    console.log('qodArray==', JSON.stringify(qodArray))

    // console.log('wtopSummaryGlobal', wtopSummary)
    // console.log('ptowSummaryGlobal', ptowSummary)
  
}

function getQod(ptowSummary,uiArray) {
    var qodArray = []
    
    var qodMap = {}
    for (var i in ptowSummary) {    //遍历每个点
        var errSum = 0
        var errToPAArray = []
       
        var qod = []
        for (var pIndex in ptowSummary[i].addressArry) { //遍历当前点的每个人
            
            var errToPA = {}
            var collectData = ptowSummary[i].addressArry[pIndex].collectdata
            var truth = 0
            for (var uIndex in uiArray) {
                if (uiArray[uIndex].dataplace == ptowSummary[i].placeName) {
                    truth = uiArray[uIndex].ui
                }else{
                    continue
                }
            } 

            //对于每个点，求每个人采集值与这个点真实值的误差
            var eatchErr = Math.abs(collectData - truth)
            errToPA.uaddress = ptowSummary[i].addressArry[pIndex].uaddress
            errToPA.dataplace = ptowSummary[i].placeName
            errToPA.err = eatchErr
            //对当前点所有误差求和
            errSum = errSum + eatchErr

            errToPAArray.push(errToPA)

        }
      
        for ( var i in errToPAArray) {
            var eachQod = {}

            eachQod.qodcontent = ((errSum - errToPAArray[i].err) / errSum).toFixed(2)
            eachQod.dataplace = errToPAArray[i].dataplace
            qod.push(eachQod)
            qodMap.uaddress = errToPAArray[i].uaddress
            qodMap.qod = qod
        }      
        qodArray.push(qodMap)
    }
    
    return qodArray

}

function calcuUi(alldata, ptowSummary ,bjArray) {
    // var ptowSummary = []    //采集点-->人的集合
    //2 算每个点的真实值--ui
    //2.1 统计每个点都有哪些人采了
    var tempwData = JSON.parse(JSON.stringify(alldata)) //深拷贝
    for (var i in alldata) {
        var pTow = {}
        if (tempwData[i].dataplace == null) {
            continue
        }
        pTow.placeName = alldata[i].dataplace
        var addressArry = []
        for (var j in alldata) {
            if (alldata[j].dataplace == alldata[i].dataplace) {
                var uaddContent = {}
                uaddContent.uaddress = alldata[j].uaddress
                uaddContent.collectdata = alldata[j].datacontent.collectdata
                for (var bjIndex in bjArray) {
                    if (bjArray[bjIndex].uaddress == alldata[j].uaddress) {
                        uaddContent.bj = bjArray[bjIndex].bj
                    } else {
                        continue
                    }
                }

                addressArry.push(uaddContent)
                tempwData[j].dataplace = null
            } else {
                continue
            }
        }
        pTow.addressArry = addressArry
        console.log('addressArry', JSON.stringify(addressArry))
        ptowSummary.push(pTow)

    }

    console.log('ptowSummary', ptowSummary)
    
    //2.2 算ui
    var uiArray = []
    for (var i in ptowSummary) {
        var uiContent = {}
        
        var uiresult = 0
        for (var addIndex in ptowSummary[i].addressArry) {
            //1、每个人在i点采集的值 - 这个人的偏差bj
            var collectData = ptowSummary[i].addressArry[addIndex].collectdata
            var bj = ptowSummary[i].addressArry[addIndex].bj
            var sub = Math.abs(collectData - bj)
            //2、求和
            uiresult = uiresult + sub
        }
        //3、除以采了当前点的总人数
        uiresult = uiresult / ptowSummary[i].addressArry.length
        uiresult = uiresult.toFixed(2) //保留2位小数
        uiContent.dataplace = ptowSummary[i].placeName
        uiContent.ui = uiresult
        uiArray.push(uiContent)
        console.log('uiContent==', JSON.stringify(uiContent))
    }  
    return uiArray  

}


function calcuBj(alldata,wtopSummary) {
    // var wtopSummary = []    //人-->采集点集合
    //1 算每个人的偏差--bj
    //1.1 统计每个人采了哪些点
    var tempwData = JSON.parse(JSON.stringify(alldata)) //深拷贝
    for (var i in alldata) {
        var wTop = {}
        if (tempwData[i].uaddress == null) {
            continue
        }
        wTop.uaddress = alldata[i].uaddress
        var placeArry = []
        for (var j in alldata) {

            if (alldata[j].uaddress == alldata[i].uaddress) { //&& tempwData[j].uaddress != null
                var placeContent = {}
                placeContent.dataplace = alldata[j].dataplace
                placeContent.datacontent = alldata[j].datacontent
                placeArry.push(placeContent)

                tempwData[j].uaddress = null
            } else {
                continue
            }


        }
        wTop.place = placeArry
        console.log('place', JSON.stringify(placeArry))
        wtopSummary.push(wTop)

    }
    console.log('wtopSummary', wtopSummary)


    //1.2 算bj
    var bjArray = []
    for (var wi in wtopSummary) {
        var bjContent = {}
        var bjresult = 0
        for (var pi in wtopSummary[wi].place) {
            //1、这个人在每个点采的值-这个点的固定值
            var collectdata = wtopSummary[wi].place[pi].datacontent.collectdata
            var placedata = wtopSummary[wi].place[pi].datacontent.placedata
            var sub = Math.abs(collectdata - placedata)
            //2、求和
            bjresult = bjresult + sub
        }
        //3、除以这个人共采集的点数
        bjresult = bjresult / wtopSummary[wi].place.length
        // bjresult = bjresult.toFixed(3)
        bjContent.uaddress = wtopSummary[wi].uaddress
        bjContent.bj = bjresult
        bjArray.push(bjContent)
        console.log('bjContent==', JSON.stringify(bjContent))
    }
    // console.log('bjArray==', JSON.stringify(bjArray))
    return bjArray
}

module.exports = { data, calcuQod }