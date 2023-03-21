import dayjs from 'dayjs'

var customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)


function displayDate(datetime){
    return dayjs(datetime).format('D MMM YYYY');   
}

function displayDateInMMMYY(datetime){
    return dayjs(datetime).format('MMM YY');   
}

function displayDateTime(datetime){
    return dayjs(datetime).format('D MMM YYYY, h:mm A');   
}

export {displayDate,displayDateInMMMYY,displayDateTime};