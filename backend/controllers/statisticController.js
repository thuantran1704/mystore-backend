import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'


class Obj {
    constructor(name, sold) {
        this.name = name;
        this.sold = sold;
    }
}
class Obj1 {
    constructor(orderItems) {
        this.orderItems = orderItems;
    }
}
class Obj11 {
    constructor(id, name, qty) {
        this.id = id;
        this.name = name;
        this.qty = qty;
    }
}

class Obj2 {
    constructor(id, totalPrice, orderItems, createdAt) {
        this.id = id;
        this.totalPrice = totalPrice;
        this.orderItems = orderItems;
        this.createdAt = createdAt;
    }
}

// @desc        Statistic product sold
// @route       GET /api/statistic
// @access      Private/Admin
const statisticProductSold = asyncHandler(async (req, res) => {
    const products = await Product.find({ sold: { $gte: 1 } }).sort("-sold")
        .populate('brand', 'name').populate('category', 'name')
        .populate('reviews.user', 'name')
    if (products) {
        res.json(products)
    } else {
        res.status(404)
        throw new Error('Statistic error')
    }
})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    // console.log("date:" + day);
    // console.log("month:" + month);
    // console.log("year:" + year);

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}

// @desc        Statistic order between date
// @route       GET /api/statistic/between
// @access      Private/Admin
const statisticOrderBetween = asyncHandler(async (req, res) => {
    const { dateFrom, dateTo } = req.body
    if (dateFrom && dateTo) {

        console.log("from : " + new Date(dateFrom.toString()))
        console.log("to : " + new Date(dateTo.toString() + "T23:59:59"))

        var query = {
            $and: [{
                "createdAt": {
                    $gte: new Date(dateFrom.toString()),
                    $lte: new Date(dateTo.toString() + "T23:59:59")
                },
                "status": "Received"
            }]
        };
        const orders = await Order.find(query).populate("orderItems.product", "name")
        res.json(orders)
    }
    else {
        res.status(404)
        throw new Error('Statistic error')
    }
})



// @desc        Statistic product sold between date
// @route       GET /api/statistic/productbetween
// @access      Private/Admin
const statisticProductBetween = asyncHandler(async (req, res) => {
    const dateFrom = req.body.dateFrom
    const dateTo = req.body.dateTo

    if (dateFrom && dateTo) {

        var query = {
            $and: [{
                "createdAt": {
                    $gte: formatDate(dateFrom),
                    $lte: formatDate(dateTo) + "T23:59:59"
                },
                "status": "received"
            }]
        };

        const orders = await Order.find(query)

        var array = []
        if (orders) {
            for (let i = 0; i < orders.length; i++) {
                const obj = new Obj2
                obj.id = orders[i]._id
                obj.totalPrice = orders[i].totalPrice
                obj.orderItems = orders[i].orderItems
                obj.createdAt = orders[i].createdAt
                array.push(obj)
            }
            res.json(array)
        } else {
            res.status(404)
            throw new Error('Statistic error')
        }
    }
    else {
        res.status(404)
        throw new Error('Statistic error here')
    }
})


export {
    statisticProductBetween,
    statisticProductSold,
    statisticOrderBetween
}