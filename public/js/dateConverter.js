function date_converter(date_temp){
        let date = new Date(date_temp)
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = String(date.getFullYear());
        let minute = String(date.getMinutes());
        let hour = String(date.getHours());
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (minute.length < 2) minute = '0' + minute;
        if (hour.length < 2) hour = '0' + hour;
        return  day+'/'+month+"/"+year+" "+hour+":"+minute;
}