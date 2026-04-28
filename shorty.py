import string
import random

def shorten_url(url: str) -> str:
    """Generate a random string of 6 characters."""
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choices(characters, k=6))