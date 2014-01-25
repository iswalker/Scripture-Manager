#access POST data parameters here [book, chapter, verses, version]
from urllib2 import urlopen
from nltk import clean_html as html_to_text

"""
Takes care of database stuff for saving the verse corresponding
to the reference at hand
"""
def save_passage(post_params): #temp
	""" temp
	PassageQueue.add(verse)
	PassageQueue.save()
	"""
	book = post_params[0]
	chapter = post_params[1]
	verses = post_params[2]
	version = post_params[3]

	book_url = generate_url_string(book)
	url = "http://www.biblegateway.com/passage/?search="+book_url+"%20"+chapter+":"\
			+verses+"&version="+version+"&interface=print"
	try:
		raw_html = urlopen(url).read()
	except: # catch exceptions here, temp
		return #json_response{'success': false, 'error': '?'}
	# if this is user's first time, ask them now what their preferred
	# version is from the values on this page are and save these values
	# in the database to be drawn from in the future

	passages = parse_for_passages(raw_html)

	return passages  #temp
	"""
	# do database stuff here of Reference.passage = passages, Reference.save()
	
	PassageQueue.remove(verse)
	PassageQueue.save()
	return json_response{'success': true}
	"""


"""
Formats a string for a book of the Bible to be ok for BibleGateway's
url format of having %20 for every space
"""
def generate_url_string(book):
	if book.contains("\s"):
		book.replace("\s", "%20")
	return book


"""
Takes in a page of text from BibleGateway and returns the chunks of
text corresponding to the actual passages in question
"""
def parse_for_passages(raw_html):
	split_page = html_to_text(raw_html).split("(NIV)") #temp, should be +version+
	
	passage_blocks = []
	# example: for length of 5 blocks, the 2nd and 4th blocks will
	#          contain the relevant information
	for i in range( (len(split_page)-1) / 2 ):
		passage_blocks += [split_page[i*2 + 1]]

	for i in range(len(passage_blocks)):
		if passage_blocks[i].find("Footnotes") != -1:
			passage_blocks[i] = passage_blocks[i].split("Footnotes")[0]
		if passage_blocks[i].find("Cross references") != -1:
			passage_blocks[i] = passage_blocks[i].split("Cross references")[0]
		if passage_blocks[i].find("      ") != -1:
			passage_blocks[i] = passage_blocks[i].split("      ")[0]

	clean_blocks = []
	for block in passage_blocks:
		clean_blocks += remove_weird_symbols(block)

	return clean_blocks


"""
Takes in a string and removes the known strange characters that slip by
in the conversion between html and plain text.  Uses a recursive helper
function to parse through it.
"""
def remove_weird_symbols(block):
	# custom replacements that encoding doesn't seem to fix
	block = block.encode('string-escape')
	block = block.replace(r'\xe2\x80\x99', '\'')
	block = block.replace(r'\xe2\x80\x9c', '\"')
	block = block.replace(r'\xe2\x80\x9d', '\"')
	block = block.decode('string-escape')

	block = block.decode("utf-8").encode("ascii", "ignore")

	good_chars = parse_by_char(0, block, [], [])

	clean_block = ""
	for char in good_chars:
		clean_block += char

	clean_block = clean_block.replace('  ', ' ')
	clean_block = clean_block.strip()

	return [clean_block]  # keeps the strings from merging together


"""
Helper function for remove_weird_symbols to recursively move through
the string block
"""
def parse_by_char(i, block, history, good_chars):
	# if we reach the end, we know where all the good char's are
	if i == len(block):
		return update_history(history, good_chars, True) # we only want the char array
	
	current = block[i]

	# skip this and next 4 char's if we find a [
	if current == '[':
		i += 5
		return parse_by_char(i, block, history, good_chars)
	elif current == '\n' or current == '=':
		i += 1
		return parse_by_char(i, block, history, good_chars)
	elif current == '&':
		i += 4
		return parse_by_char(i, block, history, good_chars)
	
	history += current
	result = update_history(history, good_chars, False)
	history = result[0]
	good_chars = result[1]

	i += 1	# move on to the next char
	return parse_by_char(i, block, history, good_chars)


"""
Takes in a queue of chars and decides if they should be
dumped into the array of good_chars or cleared out
"""
def update_history(history, good_chars, is_end):
	delete_length = 5
	history_length = len(history)

	if history[history_length-1] == '>':
		return [[], good_chars]	# clear history and add nothing
	elif history[history_length-1].isdigit():
		return [history[:history_length-2], good_chars] # subtract 2 from history and add nothing
	
	if is_end:
		good_chars += history
		return good_chars
	else:
		if history_length <= delete_length:
			return [history, good_chars] # keep history and add nothing
		else:
			good_chars += history[0]  # keep oldest value
			history = history[1:] 	  # pop oldest value
			return [history, good_chars] # update history and add one