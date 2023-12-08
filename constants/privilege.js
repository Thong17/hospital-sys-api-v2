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
            import: {
                route: 'user',
                action: 'import'
            },
            export: {
                route: 'user',
                action: 'export'
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
            import: {
                route: 'role',
                action: 'import'
            },
            export: {
                route: 'role',
                action: 'export'
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
            import: {
                route: 'doctor',
                action: 'import'
            },
            export: {
                route: 'doctor',
                action: 'export'
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
            import: {
                route: 'patient',
                action: 'import'
            },
            export: {
                route: 'patient',
                action: 'export'
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
        schedule: {
            list: {
                route: 'schedule',
                action: 'list'
            },
            detail: {
                route: 'schedule',
                action: 'detail'
            },
            create: {
                route: 'schedule',
                action: 'create'
            },
            update: {
                route: 'schedule',
                action: 'update'
            },
            delete: {
                route: 'schedule',
                action: 'delete'
            },
        },
    },
    organize: {
        product: {
            list: {
                route: 'product',
                action: 'list'
            },
            detail: {
                route: 'product',
                action: 'detail'
            },
            create: {
                route: 'product',
                action: 'create'
            },
            update: {
                route: 'product',
                action: 'update'
            },
            delete: {
                route: 'product',
                action: 'delete'
            },
            import: {
                route: 'product',
                action: 'import'
            },
            export: {
                route: 'product',
                action: 'export'
            },
        },
        stock: {
            list: {
                route: 'stock',
                action: 'list'
            },
            detail: {
                route: 'stock',
                action: 'detail'
            },
            create: {
                route: 'stock',
                action: 'create'
            },
            update: {
                route: 'stock',
                action: 'update'
            },
            delete: {
                route: 'stock',
                action: 'delete'
            },
        },
        clinic: {
            list: {
                route: 'clinic',
                action: 'list'
            },
            detail: {
                route: 'clinic',
                action: 'detail'
            },
            create: {
                route: 'clinic',
                action: 'create'
            },
            update: {
                route: 'clinic',
                action: 'update'
            },
            delete: {
                route: 'clinic',
                action: 'delete'
            },
        },
    },
    pos: {
        sale: {
            list: {
                route: 'sale',
                action: 'list'
            },
            detail: {
                route: 'sale',
                action: 'detail'
            },
            create: {
                route: 'sale',
                action: 'create'
            },
            update: {
                route: 'sale',
                action: 'update'
            },
            delete: {
                route: 'sale',
                action: 'delete'
            },
        },
        payment: {
            list: {
                route: 'payment',
                action: 'list'
            },
            detail: {
                route: 'payment',
                action: 'detail'
            },
            create: {
                route: 'payment',
                action: 'create'
            },
            update: {
                route: 'payment',
                action: 'update'
            },
            delete: {
                route: 'payment',
                action: 'delete'
            },
        },
    },
    report: {
        sale: {
            detail: {
                route: 'sale',
                action: 'detail'
            },
        },
        product: {
            detail: {
                route: 'product',
                action: 'detail'
            },
        },
    },
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
        reservation: {
            menu: 'operation',
            navbar: 'reservation'
        },
        schedule: {
            menu: 'operation',
            navbar: 'schedule'
        },
    },
    organize: {
        product: {
            menu: 'organize',
            navbar: 'product'
        },
        stock: {
            menu: 'organize',
            navbar: 'stock'
        },
        clinic: {
            menu: 'organize',
            navbar: 'clinic'
        },
    },
    pos: {
        sale: {
            menu: 'pos',
            navbar: 'sale'
        },
        payment: {
            menu: 'pos',
            navbar: 'payment'
        },
    },
    report: {
        product: {
            menu: 'report',
            navbar: 'product'
        },
        sale: {
            menu: 'report',
            navbar: 'sale'
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

