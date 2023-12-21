export default {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  database: process.env.MYSQL_DATABASE || "mydb",
  password: process.env.MYSQL_PASSWORD || "my-secret-pw",
  port: process.env.MYSQL_PORT || 3306,
};
