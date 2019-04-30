N = 10    # number of categories
n = 5     # number of categories in which g1 and g2 are not correlated
S = N*20  # total number of samples
info_miss_rate = 0 # if positive, in info.js, we don't have information for some samples that appear in g1.json and in g2.json. If negatives, in info.js, we have some samples that are not in g1.json or g2.json.  If zero, we have one-to-one correspondence between g1.json and info.json (and between g2.json and info.json).
