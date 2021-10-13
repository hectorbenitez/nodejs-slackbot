module.exports = {
    model: 'TBWSetting',
    documents: [{
        startDate: '2021-10-25 10:00',
        endDate: '2021-10-30 10:00',
        message: ':mask: Hi! Please fill out the <${form}|Covid Check Form> for today if you have not already done so. ' +
                 'You are helping to keep the whole group safer and healthier. Thank you very much! If you have any questions, ' +
                 'please contact *${responsible}* who is responsible for your *Group number: ${groupNumber}* or check all the documentation ' +
                 'regarding prevention and actions <${documentFolderLink}|here>. :mask:'
    }]
}