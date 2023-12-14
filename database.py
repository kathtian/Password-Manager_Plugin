import os
import sqlalchemy
import sqlalchemy.orm
import dotenv

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
    password = sqlalchemy.Column(sqlalchemy.String)
    website = sqlalchemy.Column(sqlalchemy.String)

# adds a username-password pair into PasswordManager table
def insert_username_password(username, password, website):
    new_username_password = PasswordManager(username=username, password=password, website=website)

    with sqlalchemy.orm.Session(_engine) as session:
        session.add(new_username_password)
        session.commit()

# removes a username-password from PasswordManager table
def delete_username_password(row_id):
    with sqlalchemy.orm.Session(_engine) as session:
        to_delete = session.query(PasswordManager).filter(PasswordManager.row_id == row_id).first()
        session.delete(to_delete)
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
            return row.username, row.password
        return None

def _test():
    # insert_username_password("kathtian", "akdsjfladksjfkl", 'https://api.elephantsql.com/console/e0b82344-c867-44c2-9364-1d2b7cbf396e/details?')
    # up = get_all_username_passwords()
    # for u in up:
    #     delete_username_password(u.row_id)
    print()

if __name__ == '__main__':
    _test()