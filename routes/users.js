var express = require('express');

const {CustomersModel} = require("../models/CustomersModel");
const {PendingIncomingsModel} = require("../models/PendingIncomingsModel");
const {ChatConversationsModel} = require("../models/ChatConversationsModel");
const {Op, QueryTypes} = require("sequelize");
const onlyServicesAccess = require("../config/middleware");
const sequelizeDB = require("../config/database");
// const {onlyServicesAccess} = require("../config/middleware");

var router = express.Router();

function telephoneCheck(str) {
    var patt = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
    return patt.test(str);
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

/*its best to call this end point from the tickets API only as it willl bring all the data as required*/
router.get('/api/v1/secured/get-ticket'/*,onlyServicesAccess*/, async function (req, res, next) {
   try {

    let ticketId = req.query.ticketId;
   /* let rows = await ChatConversationsModel.findAll({
        where: {ticketId: ticketId}
    });*/
    const table = '`chat-conversations` cc'
    let rows  = await sequelizeDB.query(`

        SELECT cc.*, c.fullName AS customerFullName,c.fullName ,c.id As customerId
        FROM ${table} 
                 JOIN customers c ON c.id = cc.senderId
        WHERE cc.isAgent = 0 AND cc.ticketId = '${ticketId}' GROUP BY cc.ticketId
    ` , { type: QueryTypes.SELECT })

       if(rows.length < 1){
           rows  = await sequelizeDB.query(`

        SELECT cc.*, c.fullName AS customerFullName ,c.fullName  ,c.id As customerId
        FROM ${table} 
                 JOIN customers c ON c.id = cc.recipientId
        WHERE cc.isAgent != 0 AND cc.ticketId = '${ticketId}' GROUP BY cc.ticketId
    ` , { type: QueryTypes.SELECT })
       }
    return res.json({
        success: true,
        message: "get chats from ticket",
        data:{
            chats: rows
        }

    });

   }catch (e) {
       console.error(e)
       return res.json({
           success: false,
           message: "get chats from ticket",


       });
   }
});


/*its best to call this end point from the tickets API only as it willl bring all the data as required*/
router.post('/api/v1/secured/merge-tickets'/*,onlyServicesAccess*/, async function (req, res, next) {

    let {ticketsIds, mergeId} = req.body;

    if (!mergeId) {
        return res.json({
            success: false,
            message: " missing required fields",

        });
    }

    // update the merger column in the database
    const ticketsIdsArr = ticketsIds.split(',').map(Number);
    let result = await ChatConversationsModel.update({mergeId: mergeId}, {where: {ticketId: ticketsIdsArr}});


    return res.json({
        success: true,
        message: "Merged tickets",
        data:{
            ticketsIds,
            mergeId,
            result,
        }

    });
});

router.get('/chats/accepted/conversion', async (req, res, next) => {
    let customerId = req.query.customerId;
    let agentId = req.query.agentId;


    let rows = await PendingIncomingsModel.findAll({
        where: {
            [Op.or]: [{senderId: customerId}, {senderId: agentId}]

        }
    });
    let rows1 = await ChatConversationsModel.findAll({
        where: {
            senderId: customerId,
            recipientId: agentId,
            $or: [
                {senderId: agentId},
                {recipientId:customerId },
            ]

//SELECT `id`, `senderId`, `companyId`, `handledByUserId`, `messageTypeId`, `content`, `handledByDateTime`, `dateCreated` FROM `pendingIncomings` AS `PendingIncomingsModel` WHERE (`PendingIncomingsModel`.`senderId` = '0' OR `PendingIncomingsModel`.`senderId` = '12')
        }
    });
    return res.json({
        success: true,
        message: " for chats  view only ",
        data: {
            chats: rows,
            chats_accepted: rows1
        }
    });
});



router.get('/chats/conversion', async (req, res, next) => {
    let customerId = req.query.customerId;


    let rows = await PendingIncomingsModel.findAll({
        where: {
            senderId: customerId
        }
    });
    return res.json({
        success: true,
        message: " for chats  view only ",
        data: {
            chats: rows
        }
    });
});

router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

router.post('/api/v1/secured/update-customer-details', async (req, res, next) => {
    try {
        const {id,fullName,phoneNumber,address,email} = req.body;
        let result = await CustomersModel.update({
            fullName,phoneNumber,address,email,isCustomer:true
        }, {where: {id: id}});

        return res.json({
            success: true,
            message: "updated Customer Details and this customer is now validate"

        });
    } catch (e) {
        console.error(e)
        return res.json({
            success: false,
            message: " Failed update Details",

        });
    }


});



router.post('/chats/agent/accept-ticket', (req, res, next) => {
    res.send('respond with a resource');
});

router.get('/chats/pending/messages', async (req, res, next) => {
    let customerId = req.query.customerId;

    let rows = await PendingIncomingsModel.findAll({
        where: {
            senderId: customerId
        }
    });

    return res.json({
        success: true,
        message: " for chats  view only ",
        data: {
            count: rows.length
        }
    });

});

router.post('/widget/save-session-customer', async (req, res, next) => {

    let {name, emailPhoneNumber, companyId} = req.body;
    try {
        let customer = await CustomersModel.create({
            fullName: name,
            companyId: companyId,
            phoneNumber: telephoneCheck(emailPhoneNumber) ? emailPhoneNumber : null,
            email: validateEmail(emailPhoneNumber) ? emailPhoneNumber : null,
        });
        return res.json({
            success: true,
            message: "Customer Added  ",
            data: {
                customer
            }
        });
    } catch (e) {
        console.error(e)
        return res.json({
            success: false,
            message: "Failed to save ",

        });
    }


});

module.exports = router;
