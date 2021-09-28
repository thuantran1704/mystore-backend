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
    const products = await Product.find({ sold: { $gte: 1 } }).sort("-sold").limit(10)
    var array = []
    if (products) {
        for (let i = 0; i < products.length; i++) {
            const obj = new Obj
            obj.name = products[i].name
            obj.sold = products[i].sold
            array.push(obj)
        }
        res.json(array)
    } else {
        res.status(404)
        throw new Error('Statistic error')
    }
})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth()),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

// @desc        Statistic order between date
// @route       GET /api/statistic/between
// @access      Private/Admin
const statisticProductBetween = asyncHandler(async (req, res) => {
    const { dateFrom, dateTo } = req.body
    if (dateFrom && dateTo) {
        var part1 = dateFrom.split('-')
        var part2 = dateTo.split('-')
        var from = new Date();
        from.setFullYear(part1[0], part1[1], part1[2]);
        var to = new Date();
        to.setFullYear(part2[0], part2[1], part2[2]);
        var query = {
            $and: [{
                "createdAt": {
                    $gte: formatDate(from),
                    $lte: formatDate(to) + "T23:59:59"
                },
                "isDelivered": true
            }]
        };
        const orders = await Order.find(query)
        var sum = 0
        var arrId = []
        var array = []
        var array2 = []
        var result = []
        var temp = 0
        if (orders) {
            for (let i = 0; i < orders.length; i++) {
                sum += orders[i].totalPrice
                const obj = new Obj1
                obj.orderItems = orders[i].orderItems
                array.push(obj)
            }
            
            for (let j = 0; j < array.length; j++) {
                for (let k = 0; k < array[j].orderItems.length; k++) {
                    const obj1 = new Obj11
                    obj1.id = array[j].orderItems[k].product;
                    obj1.name = array[j].orderItems[k].name;
                    obj1.qty = array[j].orderItems[k].qty;
                    array2.push(obj1)
                }
            }

            for (let a = 0; a < array2.length; a++) {
                temp = arrId.findIndex(ab => ab === array2[a].id.toString())

                if (temp === -1) {
                    const obj = new Obj
                    obj.name = array2[a].name
                    obj.sold = Number(array2[a].qty)
                    result.push(obj)
                    arrId.push(array2[a].id.toString())
                }
                else {
                    result[temp].sold += Number(array2[a].qty)
                }
            }

            result.sort(function (a, b) {
                return b.sold - a.sold;
            });

            const rs = {
                result : result,
                sum : sum
            }
            res.json(rs)
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



// @desc        Statistic product between date
// @route       GET /api/statistic/between
// @access      Private/Admin
const statisticOrderBetween = asyncHandler(async (req, res) => {
    const dateFrom = req.body.dateFrom
    const dateTo = req.body.dateTo

    if (dateFrom && dateTo) {
        var part1 = dateFrom.split('-')
        var part2 = dateTo.split('-')

        var from = new Date();
        from.setFullYear(part1[0], part1[1], part1[2]);
        var to = new Date();
        to.setFullYear(part2[0], part2[1], part2[2]);

        var query = {
            $and: [{
                "createdAt": {
                    $gte: formatDate(from),
                    $lte: formatDate(to) + "T23:59:59"
                },
                "isDelivered": true
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