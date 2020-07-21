import datetime

def stringToTime(timeString):
    elements = timeString.split(':')
    hour = elements[0]
    if len(elements) > 0:
        hour = int(elements[0])
        if len(elements) > 1:
            min = int(elements[1])
            if len(elements) > 2:
                sec = int(elements[2])
            else:
                sec = 0
        else:
            min = 0
            sec = 0
    else:
        hour = 0
        min = 0
        sec = 0
    
    return datetime.time(hour, min, sec)