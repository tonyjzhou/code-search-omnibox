import sys

MAX_CONTEXT_LENGTH = 128

def is_ascii(string):
  try:
    string.decode('ascii')
  except UnicodeDecodeError:
    return False
  else:
    return True

for line in sys.stdin:
  if not is_ascii(line):
    continue

  parts = line.split(' ')
  context = parts[0]

  if len(context) > MAX_CONTEXT_LENGTH:
    parts[0] = context.split('.')[0] \
      if '.' in context and len(context.split('.')[0]) <= MAX_CONTEXT_LENGTH \
      else ' '

  sys.stdout.write(' '.join(parts))