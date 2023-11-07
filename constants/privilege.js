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
        doctor: {
            list: {
                route: 'doctor',
                action: 'list'
            },
            detail: {
                route: 'doctor',
                action: 'detail'
            },
            create: {
                route: 'doctor',
                action: 'create'
            },
            update: {
                route: 'doctor',
                action: 'update'
            },
            delete: {
                route: 'doctor',
                action: 'delete'
            },
            approve: {
                route: 'doctor',
                action: 'approve'
            },
            reject: {
                route: 'doctor',
                action: 'reject'
            },
        },
        patient: {
            list: {
                route: 'patient',
                action: 'list'
            },
            detail: {
                route: 'patient',
                action: 'detail'
            },
            create: {
                route: 'patient',
                action: 'create'
            },
            update: {
                route: 'patient',
                action: 'update'
            },
            delete: {
                route: 'patient',
                action: 'delete'
            },
            approve: {
                route: 'patient',
                action: 'approve'
            },
            reject: {
                route: 'patient',
                action: 'reject'
            },
        },
    },
    operation: {
        reservation: {
            list: {
                route: 'reservation',
                action: 'list'
            },
            detail: {
                route: 'reservation',
                action: 'detail'
            },
            create: {
                route: 'reservation',
                action: 'create'
            },
            update: {
                route: 'reservation',
                action: 'update'
            },
            delete: {
                route: 'reservation',
                action: 'delete'
            },
            accept: {
                route: 'reservation',
                action: 'accept'
            },
            refuse: {
                route: 'reservation',
                action: 'refuse'
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
        doctor: {
            menu: 'admin',
            navbar: 'doctor'
        },
        patient: {
            menu: 'admin',
            navbar: 'patient'
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

