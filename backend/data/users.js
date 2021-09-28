import bcrypt from 'bcryptjs'

const users = [{
        name: 'Admin',
        email: 'thuantran1704@gmail.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: true
    },
    {
        name: 'User',
        email: 'aloo@gmail.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: false

    },
    {
        name: 'Thien',
        email: 'alooo@gmail.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: false
    },
]

export default users