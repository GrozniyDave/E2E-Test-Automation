$('#user_table').bootstrapTable({
    columns: [{
        field: 'id',
        title: 'ID'
    }, {
        field: 'username',
        title: 'Username'
    }, {
        field: 'fullName',
        title: 'Full Name'
    }, {
        field: 'fullName',
        title: 'Birth date',
    }],
    data: [{
        id: 1,
        name: 'Item 1',
        price: '$1'
    }, {
        id: 2,
        name: 'Item 2',
        price: '$2'
    }]
});
