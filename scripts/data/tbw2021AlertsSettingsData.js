module.exports = {
    model: 'TBWSetting',
    documents: [{
        startDate: '2021-10-25 10:00',
        endDate: '2021-10-30 10:00',
        message: ':mask: Hi *${userName}*! \nPlease fill out the <${form}|Covid Check Form> for today if you have not already done so. ' +
                 'You are helping to keep the whole group safer and healthier, thank you very much! \nIf you have any questions, ' +
                 'please contact *${responsible}* who is responsible for your *Group number: ${groupNumber}* or check all the documentation ' +
                 'regarding prevention and actions <${documentFolderLink}|here>. :mask:',
        responsibleMessage: ':mask: Hi *${responsible}* ! \nPlease fill out the <${form}|Covid Check Form> for today if you have not already done so. ' +
                 'Also, remember to check if your group is answering the form in a daily basis. \n' + 
                 'We really appreciate your help and the time you are devoting to making TBW much safer. \n' +
                 'All the documentation regarding prevention and actions is <${documentFolderLink}|here>. :mask:' +
                 '\nThank you very much!'
    }]
}