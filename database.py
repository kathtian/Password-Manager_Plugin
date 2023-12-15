import os
import sqlalchemy
import sqlalchemy.orm
import dotenv
import array
import base64

dotenv.load_dotenv()
_DATABASE_URL = os.environ['DATABASE_URL']
_DATABASE_URL = _DATABASE_URL.replace('postgres://', 'postgresql://')

Base = sqlalchemy.orm.declarative_base()

_engine = sqlalchemy.create_engine(_DATABASE_URL)

# Tables
class PasswordManager(Base):
    __tablename__ = 'password_manager'
    row_id = sqlalchemy.Column(sqlalchemy.Integer, primary_key = True, autoincrement = True)
    username = sqlalchemy.Column(sqlalchemy.String)
    password = sqlalchemy.Column(sqlalchemy.LargeBinary)
    iv = sqlalchemy.Column(sqlalchemy.LargeBinary)
    website = sqlalchemy.Column(sqlalchemy.String)

# adds a username-password pair into PasswordManager table
def insert_username_password(username, password, iv, website):
    new_username_password = PasswordManager(username=username, password=password, iv=iv, website=website)

    with sqlalchemy.orm.Session(_engine) as session:
        session.add(new_username_password)
        session.commit()

# removes a username-password from PasswordManager table
def delete_username_password():
    with sqlalchemy.orm.Session(_engine) as session:
        rows_to_delete = session.query(PasswordManager).all()
        for row in rows_to_delete:
            session.delete(row)
        session.commit()

# returns a list of all username-passwords
def get_all_username_passwords():
    with sqlalchemy.orm.Session(_engine) as session:
        query = session.query(PasswordManager)
        username_passwords = query.all()
    return username_passwords

# returns username-password for a given website if it exists in the db
def get_username_password_by_website(website):
    with sqlalchemy.orm.Session(_engine) as session:
        row = session.query(PasswordManager).filter(PasswordManager.website == website).first()
        if row:
            encoded_password = base64.b64encode(row.password).decode('utf-8')
            encoded_iv = base64.b64encode(row.iv).decode('utf-8')
            return {
                'username': row.username,
                'password': encoded_password,
                'iv': encoded_iv
            }
        return None

def _test():
    print()

if __name__ == '__main__':
    _test()
