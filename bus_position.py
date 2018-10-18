
import requests
import asyncio
import datetime

# Establishing authentication
# Url base for requesting sources to SP Trans API
url_base = 'http://api.olhovivo.sptrans.com.br/v2.1/'

session = requests.Session()

# Token obtained in http://www.sptrans.com.br/desenvolvedores/APIOlhoVivo/Documentacao.aspx
token = '7bb876e44542842505ed5b13d70a959c28c31773f28700bafec208961fe382f0'

auth = session.post("%sLogin/Autenticar?token=%s" % (url_base,token))
print("%sLogin/Autenticar?token=%s" % (url_base,token))

# Getting all buses information about position every 5 seconds
def get_position_5s(id):
    if auth.text == 'true':
        response = session.get("%s/Posicao" % url_base)
        if response.status_code == 200:
            data = response.json()
            new_file = open("leitura-" + data["hr"] + "-"+ str(id) + ".json","w")
            new_file.write(response.text)
            new_file.close()
            print(data)

def main():
    round = 0
    while(True):
        print(datetime.datetime.now())
        round += round + 1
        get_position_5s(round)

main()
# file = open("leitura_15:44_1.json").read()
# data = json.loads(file)
