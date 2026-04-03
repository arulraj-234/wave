from db import execute_query

def run():
    try:
        with open('migration_issues.sql', 'r') as f:
            sql = f.read()
            execute_query(sql)
        print("Migration successful")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == '__main__':
    run()
