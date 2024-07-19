
import re

def process_str_num(strnum) -> float:
    match strnum[-1]:
        case "k":
            return float(strnum[:-1]) * 10**3
        case "m":
            return float(strnum[:-1]) * 10**6
        case "t":
            return float(strnum[:-1]) * 10**6
        case _:
            return float(strnum)



# Sample log line
log_line = "[07:37:54] weaken: 'iron-gym' security level weakened to 10. Gained 13.215m hacking exp (t=468)"

# Regular expression to extract the required information
pattern = r"\[(?P<time>\d{2}:\d{2}:\d{2})\] (?P<script_name>\w+): '(?P<host_name>[^']+)' security level weakened to (?P<security_level>\d+). Gained (?P<experience>[\d.]+.?) hacking exp"

# Compiling the regular expression
p_weaken_done = re.compile(pattern)
p_weaken_done = re.compile(pattern)

# Searching the log line using the compiled pattern
match = p_weaken_done.search(log_line)

if match:
    # Extracting the groups
    script_name = match.group('script_name')
    host_name = match.group('host_name')
    experience = process_str_num(match.group('experience'))
    security_level = match.group('security_level')

    # Printing the extracted information
    print(f"Script Name: {script_name}")
    print(f"Host Name: {host_name}")
    print(f"Experience: {experience}")
    print(f"Security Level: {security_level}")
else:
    print("No match found")