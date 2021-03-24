# SELECT

key principles:
- SELECT is the method to "READ" a SQL database
- can SELECT all columns, a single column, or multiple columns
- can be "modified" with clauses:
  - https://en.wikipedia.org/wiki/SELECT_(SQL)
- wildcard searches are possible with the "LIKE %" operator

```sql
SELECT * FROM Customers 

-- next show how to cherry pick the columns we want on the results and that they 
-- can be on any order
SELECT City, CustomerName, ContactName FROM Customers

-- how to filter using the WHERE clause
SELECT City, CustomerName, ContactName
FROM Customers
-- this online tool is case sensitive when comparing strings, that is normally 
-- not the case 
WHERE City = 'Berlin' 

-- AND and OR operator
SELECT City, CustomerName, ContactName
FROM Customers
WHERE Country = 'France' OR City = 'Berlin'

-- change it to use AND
WHERE Country = 'France' AND City = 'Paris'

-- filter with LIKE:
SELECT * FROM Customers WHERE City LIKE 'B%'
```

-Write a query to get the list of products with category id of 2 (How many
records do you get?) 
-Write a query to get the the name of category id of 2 (What is the name?)
-Write a query to get the list of Suppliers in USA with a SupplierName that
begins with N. 

A possible solution:

```sql
SELECT * FROM Products WHERE CategoryId = 2

SELECT Name FROM Categories WHERE CategoryId = 2

SELECT * FROM Suppliers WHERE SupplierName LIKE 'N%' AND Country = 'USA'
```


# ORDER BY

key principles:
- sorts the records
- can sort by a column that is not returned
- can sort ascending or descending

```sql
SELECT * FROM Products ORDER BY Price -- can be DESC or ASC, it is ASC by default 

-- what if we want it descending
SELECT * FROM Products ORDER BY Price DESC
```

-Write a query to get the list of products that cost more than 50 organized by
price, descending. 

A possible solution:

```sql
SELECT * FROM Products
WHERE Price > 50        -- note that WHERE must come before ORDER BY
ORDER BY Price DESC
```

# LIMIT

LIMIT can be used to show a limited number of records.
We can use it with an ORDER BY statement to show to 5 most expensive products

```sql
SELECT * FROM Products
ORDER BY Price DESC
LIMIT 5
```

# INSERT


```sql
-- show basic syntax
-- we can add fields in any order, the VALUES just need to be in the same ordinal position
-- note the id will automatically be assigned
INSERT INTO Customers (Country, CustomerName, ContactName, Address, City, PostalCode)
VALUES ('USA', 'Lambda School', 'Austen Allred', '1 Lambda Court', 'Provo', '84601');

-- get the inserted record
SELECT * FROM Customers ORDER BY Id DESC LIMIT 3
```

-Insert a new shipper into the Shippers table

```sql
INSERT INTO Shippers ( ShipperName, Phone )
VALUES ( 'Ship2U', '(555) 666-7777')
```


# UPDATE

```sql
UPDATE Customers SET City = 'Silicon Valley'
WHERE CustomerName = 'Lambda School'
```

```sql
-- demonstrate what happens when the WHERE clause is missing
UPDATE Customers SET City = 'Silicon Valley'
-- reset the database
```


# DELETE

```sql
DELETE FROM Customers
-- always remember to have a WHERE clause or it will delete all records in the table
WHERE CustomerName = 'Around the Horn'
```

- Delete all customers FROM the UK

```sql
DELETE FROM Customers
WHERE Country = 'UK'
-- should delete 6 records ('Around the Horn', deleted above, is also FROM UK... 
-- there were 7, we deleted 1, now we deleted the other 6)
```