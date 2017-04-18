import csv
import json

csvfile = open("Graves_Art_Sales_1010.csv", "r")
jsonfile = open("Graves_Art_Sales_1010.json", "w")

fieldnames = ("artist", "year", "monthday", "auction house", "seller", "artwork title 1", "Measurements", "purchaser", "pounds", "shillings", "pence")
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write("\n")
