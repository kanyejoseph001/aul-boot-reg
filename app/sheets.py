import gspread

gc = gspread.service_account(
    filename="credentials.json"
)

spreadsheet = gc.open(
    "Booth Registrations"
)

pending_sheet = spreadsheet.worksheet(
    "Pending Registrations"
)

completed_sheet = spreadsheet.worksheet(
    "Completed Registrations"
)


def email_exists(email):

    rows = completed_sheet.get_all_records()

    for row in rows:
        if row["email"].lower() == email.lower():
            return True

    return False


def phone_exists(phone):

    rows = completed_sheet.get_all_records()

    for row in rows:
        if row["phone"] == phone:
            return True

    return False


def save_pending_registration(data):

    pending_sheet.append_row(data)


def get_pending_registration(reference):

    rows = pending_sheet.get_all_records()

    for index, row in enumerate(rows, start=2):

        if row["reference"] == reference:
            return row, index

    return None, None


def delete_pending_registration(row_index):

    pending_sheet.delete_rows(row_index)


def save_completed_registration(data):

    completed_sheet.append_row(data)