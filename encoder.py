from json import JSONEncoder

class RelayEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__