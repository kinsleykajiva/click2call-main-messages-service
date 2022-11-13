var express = require('express');
const {QueryTypes, Op} = require("sequelize");
const sequelizeDB = require("../config/database");
const axios = require("axios");
const {ChatConversationsModel} = require("../models/ChatConversationsModel");
const {CustomersModel} = require("../models/CustomersModel");
const moment = require("moment-timezone");
const {PendingIncomingsModel} = require("../models/PendingIncomingsModel");
var router = express.Router();

/* GET home page. */

router.get('/', function (req, res, next) {
    return res.json({
        success: true,
        message: " messaging Service is chatting with you tooo @ 322",

    });
});



router.get('/index', function (req, res, next) {
    return res.json({
        success: true,
        message: " Service is chatting with you tooo @ 322",

    });
});

router.post('/api/v1/conversation/updateCustomerIncomingMessageWebsiteCompanyOnline', function (req, res, next) {

    //

    try{
        const {senderId, handledByUserId ,ticketObjj} = req.body;
        console.log('xxxxxxx-ticketObjj--xxxxxx' ,ticketObjj)

        let handledByDateTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
          PendingIncomingsModel.update({
            senderId, handledByUserId, handledByDateTime
        }, {where: {senderId, handledByUserId: 0}})

        return res.json({
            success: true,
            message: "",

        });
    }catch{
        return res.json({
            success: false,
            message: " Service is chatting with you tooo @ 322",

        });
    }

});

router.post('/api/v1/conversation/saveCustomerIncomingMessageWebsiteCompanyOnline', function (req, res, next) {

    //

    try{
        let {senderId, companyId, handledByUserId, content} = req.body;
        handledByUserId = handledByUserId || 0;
        PendingIncomingsModel.create({
            senderId, companyId, handledByUserId, content
        })
        return res.json({
            success: true,
            message: "",

        });
    }catch{
        return res.json({
            success: false,
            message: " Service is chatting with you tooo @ 322",

        });
    }

});
router.post('/api/v1/conversation/chatconversations', function (req, res, next) {

    //

    try{
        let {senderId, ticketId, recipientId, content,isAgent} = req.body;
        console.log('xxxxxxx-ticketId--xxxxxx' ,ticketId)

        ChatConversationsModel.create({
            senderId,
            ticketId,
            recipientId,
            content,
            isAgent
        });
        return res.json({
            success: true,
            message: "",

        });
    }catch{
        return res.json({
            success: false,
            message: " Service is chatting with you tooo @ 322",

        });
    }

});
router.post('/api/v1/secured/widget/save-new-customer', async function (req, res, next) {

    try {
        const {customerId} = req.body;
       let result =  await CustomersModel.update({
            isCustomer: 1
        }, {where: {id: customerId}});

        return res.json({
            success: true,
            message: "Updated the customer to a valid customer",
            data: {
                customer:result
            }

        });

    } catch (e) {
        return res.json({
            success: false,
            message: "Failed to update",

        });
    }


});
router.get('/api/v1/secured/widget/get-customer', async function (req, res, next) {

    try {
        const {customerId} = req.query;

       let result =  await CustomersModel.findOne( {where: {id: customerId}}   );
        console.log(result);
        return res.json({
            success: true,
            message: "customer details",
            data: {
                customer:result
            }

        });

    } catch (e) {
        console.error(e)
        return res.json({
            success: false,
            message: "Failed to getInfo",

        });
    }


});


/*its best to call this end point from the tickets API only as it willl bring all the data as required*/
router.get('/api/v1/secured/ticket-conversations', async function (req, res, next) {

    try {
        let ticketId = req.query.ticketId;
        let customerObject = null;
        let results = await ChatConversationsModel.findAll({where: {ticketId: ticketId}});

        // test the participants if they are customers in each conversation
        for (let i = 0; i < results.length; i++) {
            let chat = results[i].dataValues;
            chat.isCustomer = false;
            let CustomerObj = await CustomersModel.findOne({where: {id: chat.senderId}});
            console.log(CustomerObj);
            if(CustomerObj){
                customerObject = CustomerObj;// this object should have one customer only as we are only looking for the customer
                chat.isCustomer = !!(CustomerObj || CustomerObj.length > 0);
                if (chat.isCustomer) {
                    chat.customerDetails = CustomerObj;
                }
            }


        }

        return res.json({
            success: true,
            message: " Conversation to ticket",
            data: {
                conversations: results,
                customer: customerObject
            }

        });

    } catch (e) {
        console.error(e);
        return res.json({
            success: false,
            message: " Failed to get the tcket data",

        });
    }


});

router.post('/api/v1/secured/conversations-to-tickets', async function (req, res, next) {
    try {
        const {ids, title} = req.body;
        console.log('ticketResult creation ', ids);
        // first of all we need to make a request to the ticket api to get the ticket id
        let ticketResult = await axios.post((process.env.MAIN_API_URL || 'http://localhost:8050') + '/ticketing-service/api/v1/secured/ticket/create', {title: title}, {
            headers: {
                'content-type': 'application/json',
                'Authorization': req.headers.authorization
            }
        });
        ticketResult = ticketResult.data;

        console.log('ticketResult creation ', ticketResult);
        if (!ticketResult.success) {
            return res.json({
                success: false,
                message: "Failed to create ticket please try again later",

            });
        }

        if (ids.includes(',')) {
            let idsArr = ids.split(',');
            for (let i = 0; i < idsArr.length; i++) {

                const id = idsArr[i];
                console.log('idsKey', id);
                await ChatConversationsModel.update({
                    ticketId: ticketResult.data.ticket.id
                }, {
                    where: {
                        [Op.or]: [{senderId: id}, {recipientId: id}],
                    }
                });
            }


        } else {
            await ChatConversationsModel.update({
                ticketId: ticketResult.data.ticket.id
            }, {
                where: {
                    [Op.or]: [{senderId: ids}, {recipientId: ids}],
                }
            });
        }

        return res.json({
            success: true,
            message: " Updated ticket id to conversations",
            data: {
                ticket: ticketResult.data
            }

        });

    } catch (e) {
        console.error(e)
        return res.json({
            success: false,
            message: " Failed to save to tickets",

        });
    }
});

router.post('/api/v1/secured/delete-conversions', async function (req, res, next) {
    try {

        const {ids} = req.body; // this id is the id of the customers in conversion table so we delete the customer since the instance of a customer means that this was a new customer

        if (ids.includes(',')) {
            const idsArray = ids.split(',');
            for (let i = 0; i < idsArray.length; i++) {
                const id = idsArray[i];
                let table = '`chat-conversations`';

                await sequelizeDB.query(`DELETE
                                         FROM customers
                                         WHERE id = ${id} `, {type: QueryTypes.DELETE});
                await sequelizeDB.query(`DELETE
                                         FROM ${table}
                                         WHERE senderId = ${id}
                                            OR recipientid = ${id}`, {type: QueryTypes.DELETE});
            }

        } else {
            let table = '`chat-conversations`';

            await sequelizeDB.query(`DELETE
                                     FROM customers
                                     WHERE id = ${ids} `, {type: QueryTypes.DELETE});
            await sequelizeDB.query(`DELETE
                                     FROM ${table}
                                     WHERE senderId = ${ids}
                                        OR recipientid = ${ids}`, {type: QueryTypes.DELETE});
        }

        return res.json({
            success: true,
            message: " Deleted the conversations",

        });
    } catch (e) {
        console.error(e)
        return res.json({
            success: false,
            message: " Failed to delete",

        });
    }
});

router.get('/api/v1/secured/conversions', async function (req, res, next) {

    try {

        let userId = req.query.userId;
        let companyId = req.query.companyId;
        let isWithTickets = req.query.isWithTickets;

        let table = '`chat-conversations`';
        const sql = `SELECT c.id          AS customerId,
                            cc.id         AS conversationId,
                            count(c.id)   AS conversationsCounter,
                            cc.senderId,
                            c.fullName    AS customerFullName,
                            c.email       AS customerEmail,
                            c.phoneNumber AS customerPhoneNumber,
                            c.isCustomer,
                            cc.recipientId,
                            messageTypeId,
                            content,
                            cc.updateTimestamp,
                            hasRead,
                            cc.dateCreated,
                            ticketId
                     FROM ${table} cc
                              JOIN customers c
                                   ON c.id = cc.recipientId
                     WHERE cc.ticketId = '${isWithTickets}'
                       AND c.companyId = '${companyId}'
                     GROUP BY c.id;

        `;
        const results = await sequelizeDB.query(sql, {raw: true, type: QueryTypes.SELECT});

        return res.json({
            success: true,
            message: " ",
            data: {
                chats: results
            }

        });
    } catch (e) {
        console.error(e);
    }
    return res.json({
        success: false,
        message: " ",
        data: null

    });
});

module.exports = router;
