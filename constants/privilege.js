exports.privilege = {
    admin: {
        user: {
            list: {
                route: 'user',
                action: 'list'
            },
            detail: {
                route: 'user',
                action: 'detail'
            },
            create: {
                route: 'user',
                action: 'create'
            },
            update: {
                route: 'user',
                action: 'update'
            },
            delete: {
                route: 'user',
                action: 'delete'
            },
            approve: {
                route: 'user',
                action: 'approve'
            },
            reject: {
                route: 'user',
                action: 'reject'
            },
        },
        role: {
            list: {
                route: 'role',
                action: 'list'
            },
            detail: {
                route: 'role',
                action: 'detail'
            },
            create: {
                route: 'role',
                action: 'create'
            },
            update: {
                route: 'role',
                action: 'update'
            },
            delete: {
                route: 'role',
                action: 'delete'
            },
            approve: {
                route: 'role',
                action: 'approve'
            },
            reject: {
                route: 'role',
                action: 'reject'
            },
        },
    }
}

exports.navigation = {
    admin: {
        role: {
            menu: 'admin',
            navbar: 'role'
        },
        user: {
            menu: 'admin',
            navbar: 'user'
        },
    },
    operation: {
        counter: {
            menu: 'operation',
            navbar: 'counter'
        },
        reservation: {
            menu: 'operation',
            navbar: 'reservation'
        },
    },
}

let menu
const menus = Object.keys(this.navigation)
menus.forEach(m => {
    menu = {
        ...menu,
        [m]: {}
    }
    Object.keys(this.navigation[m]).forEach(k => {
        menu[m][k] = false
    })
})

let role
const roles = Object.keys(this.privilege)
roles.forEach(p => {
    role = {
        ...role,
        [p]: {}
    }
    Object.keys(this.privilege[p]).forEach(k => {
        role[p] = {
            ...role[p],
            [k]: {}
        }
        Object.keys(this.privilege[p][k]).forEach(a => {
            role[p][k][a] = false
        })
    })
})

exports.preMenu = menu
exports.preRole = role

