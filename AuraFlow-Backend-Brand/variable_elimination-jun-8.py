import numpy as np

'''
Implement the variable elimination algorithm by coding the
following functions in Python. Factors are essentially 
multi-dimensional arrays. Hence use numpy multidimensional 
arrays as your main data structure.  If you are not familiar 
with numpy, go through the following tutorial: 
https://numpy.org/doc/stable/user/quickstart.html
'''



######### restrict function
# Tip: Use slicing operations to implement this function
#
# Inputs: 
# factor -- multidimensional array (one dimension per variable in the domain)
# variable -- integer indicating the variable to be restricted
# value -- integer indicating the value to be assigned to variable
#
# Output:
# resulting_factor -- multidimensional array (the dimension corresponding to variable has been restricted to value)
#########
def restrict(factor,variable,value):
	resulting_factor_shape = list(factor.shape)
	if resulting_factor_shape[variable] == 1:
		return factor
	# dummy result until the function is filled in
	slice_obj = [slice(None)] * factor.ndim
	resulting_factor = np.copy(factor[tuple(slice_obj)])
	slice_obj[variable] = value
	resulting_factor = resulting_factor[tuple(slice_obj)]
	# get the shape of the factor and change the variable dimension to 1
	# get resulting_factor shape into a list

	resulting_factor_shape[variable] = 1
	# reshape the resulting_factor to the resulting_factor_shape
	# turn resulting_factor_shape into a tuple
	resulting_factor_shape = tuple(resulting_factor_shape)

	resulting_factor = np.reshape(resulting_factor,resulting_factor_shape)

	return resulting_factor

######### sumout function
# Tip: Use numpy.sum to implement this function
#
# Inputs: 
# factor -- multidimensional array (one dimension per variable in the domain)
# variable -- integer indicating the variable to be summed out
#
# Output:
# resulting_factor -- multidimensional array (the dimension corresponding to variable has been summed out)
#########
def sumout(factor,variable):

	# dummy result until the function is filled in

	resulting_factor = np.sum(factor, axis=variable)
	resulting_factor_shape = list(factor.shape)
	resulting_factor_shape[variable] = 1
	# reshape the resulting_factor to the resulting_factor_shape
	# turn resulting_factor_shape into a tuple
	resulting_factor_shape = tuple(resulting_factor_shape)

	resulting_factor = np.reshape(resulting_factor, resulting_factor_shape)
	return resulting_factor

def print_factor(factor, factor_name, var_map_string):
	# generate a string f_{factor_name} using string formatting
	# print the string
	# print the factor
	factor_string = f"{factor_name}"
	shape_list = list(factor.shape)
	# generate a tuple of strings that are meant to be the parameters
	parameters = []
	for i in range(len(shape_list)):
		if shape_list[i] > 1:
			parameters.append(var_map_string[i])
	# generate the string
	factor_string = factor_string + "(" + ",".join(parameters) + ")"
	print(factor_string)


######### multiply function
# Tip: take advantage of numpy broadcasting rules to multiply factors with different variables
# See https://numpy.org/doc/stable/user/basics.broadcasting.html
#
# Inputs: 
# factor1 -- multidimensional array (one dimension per variable in the domain)
# factor2 -- multidimensional array (one dimension per variable in the domain)
#
# Output:
# resulting_factor -- multidimensional array (elementwise product of the two factors)
#########
def multiply(factor1,factor2):
	# All the fectors must be in thier right shape and dimension
	# The length of the sampe tuple must be the same throughtout all of the calculations
	# dummy result until the function is filled in
	resulting_factor = np.multiply(factor1, factor2)
	return resulting_factor
# write some tests for factor multiplication
factor1 = np.array([[1, 2, 3], [4, 5, 6]])
factor2 = np.array([[1, 2, 3], [4, 5, 6]])
# write an assert
assert np.all(multiply(factor1, factor2) == np.array([[1, 4, 9], [16, 25, 36]]))
######### normalize function
# Tip: divide by the sum of all entries to normalize the factor
#
# Inputs: 
# factor -- multidimensional array (one dimension per variable in the domain)
#
# Output:
# resulting_factor -- multidimensional array (entries are normalized to sum up to 1)
#########
def normalize(factor):
	sum_of_elements = np.sum(factor)

	# Divide the array by the sum of its elements
	resulting_factor = np.divide(factor, sum_of_elements)
	return resulting_factor

######### inference function
# Tip: function that computes Pr(query_variables|evidence_list) by variable elimination.  
# This function should restrict the factors in factor_list according to the
# evidence in evidence_list.  Next, it should sumout the hidden variables from the 
# product of the factors in factor_list.  The variables should be summed out in the 
# order given in ordered_list_of_hidden_variables.  Finally, the answer should be
# normalized to obtain a probability distribution that sums up to 1.
#
#Inputs: 
#factor_list -- list of factors (multidimensional arrays) that define the joint distribution of the domain
#query_variables -- list of variables (integers) for which we need to compute the conditional distribution
#ordered_list_of_hidden_variables -- list of variables (integers) that need to be eliminated according to thir order in the list
#evidence_list -- list of assignments where each assignment consists of a variable and a value assigned to it (e.g., [[var1,val1],[var2,val2]])
#a
#Output:
#answer -- multidimensional array (conditional distribution P(query_variables|evidence_list))
#########
def inference2(factor_list, query_variables, ordered_list_of_hidden_variables, evidence_list):

	# I need tp put some asserts then
	# Eliminate hidden variables
	# factor_list_test = factor_list.copy()
	for evidence in evidence_list:
		# restrict the factors in factor_list according to the evidence in evidence_list
		# get the variable and value from the evidence
		variable = evidence[0]
		value = evidence[1]

		# restrict the factors in factor_list according to the evidence in evidence_list
		# factor_list_test = [restrict(factor, variable, value) for factor in factor_list_test]
		factor_list = [restrict(factor, variable, value) for factor in factor_list]
	 	# There could be factors that do not have take variable as a parameter

	print("factors_to_multiply before run")
	for factor in factor_list:
		print_factor(factor, "fac", var_map_string)

	for variable in ordered_list_of_hidden_variables:
		if	variable in query_variables:
			continue
		# get all the factors in which the variable appears
		print(var_map_string[variable])
		# take all the factors in which the variable appears
		# that is when the dimension that is corrusponding to the variable is not 1
		factors_to_multiply = [factor for factor in factor_list if factor.shape[variable] != 1]
		print("factors_to_multiply")
		for factor in factors_to_multiply:
			print_factor(factor, "fac", var_map_string)
		print("factors_to_multiply end factors before remove")
		for factor in factor_list:
			print_factor(factor, "fac_before rem", var_map_string)


		# now make a new factor that multiplies all the factors in factors_to_multiply using the function multiply
		# initialize the new multiply factor to be a numpy array of all ones with the shape (1....1) of factor shape length
		if factors_to_multiply == []:
			continue


		multiply_factor = np.ones(factor_list[0].shape)
		# multiply all the factors in factors_to_multiply
		for factor in factors_to_multiply:
			multiply_factor = multiply(multiply_factor, factor)
		# sumout the variable from the multiply_factor
		multiply_factor = sumout(multiply_factor, variable)

		multiply_factor = normalize(multiply_factor)



		#error code
		# if multiply_factor size is 1 then it is a scalar and we do not need to append it

	query_factor = np.ones(factor_list[0].shape)
	for factor in factor_list:
		print_factor(factor, "fac", var_map_string)
	for factor in factor_list:
		query_factor = multiply(query_factor, factor)
		# right now I can only consider querries of one variable.
		# I need to make it so that it can handle querries of multiple variables
	return query_factor

def inference(factor_list, query_variables, ordered_list_of_hidden_variables, evidence_list):
	print("called inference")
	# Eliminate hidden variables

	for evidence in evidence_list:
		# restrict the factors in factor_list according to the evidence in evidence_list
		# get the variable and value from the evidence
		variable = evidence[0]
		value = evidence[1]
		# restrict the factors in factor_list according to the evidence in evidence_list
		factor_list = [restrict(factor, variable, value) for factor in factor_list]
		# There could be factors that do not have take variable as a parameter
	# need to remove duplicates
	def contains(list,np_array):
		for element in list:
			if np.array_equal(element,np_array):
				return True
		return False

	factor_list_new = []
	for factor in factor_list:
		if not contains(factor_list_new,factor):
			factor_list_new.append(factor)
	factor_list = factor_list_new



	for variable in ordered_list_of_hidden_variables:
		factors_to_multiply = []
		# get all the
		if	variable in query_variables:
			continue
		# take all the factors in which the variable appears
		# that is when the dimension that is corrusponding to the variable is not 1
		factors_to_multiply = [factor for factor in factor_list if factor.shape[variable] != 1]
		# now make a new factor that multiplies all the factors in factors_to_multiply using the function multiply
		# initialize the new multiply factor to be a numpy array of all ones with the shape (1....1) of factor shape length
		multiply_factor = np.ones(factor_list[0].shape)
		# multiply all the factors in factors_to_multiply
		for factor in factors_to_multiply:
			multiply_factor = multiply(multiply_factor, factor)
		# sumout the variable from the multiply_factor
		multiply_factor = sumout(multiply_factor, variable)
		# normalize the multiply_factor
		multiply_factor = normalize(multiply_factor)
		# remove all the factors in factors_to_multiply from factor_list



		factor_list = [factor for factor in factor_list if not contains(factors_to_multiply,factor)]








			# remove_all(factor_list, factor)
		# append the multiply_factor to factor_list
		# if
		if multiply_factor.size != 1:
			factor_list.append(multiply_factor)
		# print the factor_list
	# outside of the for loop
	query_factor = np.ones(factor_list[0].shape)
	for factor in factor_list:
		query_factor = multiply(query_factor, factor)
		# right now I can only consider querries of one variable.
		# I need to make it so that it can handle querries of multiple variables
	return query_factor

# Example Bayes net from the lecture slides: A -> B -> C

# variables
A=0
B=1
C=2
# generate a mapping from variable integers to variable names
var_map_string = {0:'A',1:'B',2:'C'}
variables = np.array(['A','B','C'])

# values
false=0
true=1
values = np.array(['false','true'])

# factors

# Pr(A)
f1 = np.array([0.1,0.9])
f1 = f1.reshape(2,1,1)
print(f"Pr(A)={np.squeeze(f1)}\n")
print_factor(f1, "f1", var_map_string)
# Pr(B|A) how is this differ from Pr(A,B)?
f2 = np.array([[0.6,0.4],[0.1,0.9]])
f2 = f2.reshape(2,2,1)
print(f"Pr(B|A)={np.squeeze(f2)}\n")
print_factor(f2, "f2", var_map_string)
# Pr(C|B)
f3 = np.array([[0.8,0.2],[0.3,0.7]])
f3 = f3.reshape(1,2,2)
print(f"Pr(C|B)={np.squeeze(f3)}\n")
print_factor(f3, "f3", var_map_string)
# multiply two factors
f4 = multiply(f2,f3)
print(f"multiply(f2,f3)={np.squeeze(f4)}\n")

# sumout a variable
f5 = sumout(f2,A)
print(f"sumout(f2,A)={np.squeeze(f5)}\n")

# restricting a factor
f6 = restrict(f2,A,true)
print(f"restrict(f2,A,true)={np.squeeze(f6)}\n")

# inference P(C)
f7 = inference([f1,f2,f3],[C],[A,B],[])
print(f"P(C)={np.squeeze(f7)}\n")

f8 = inference([f1,f2,f3],[C],[A,B],[(B,true)])
print(f"f8={np.squeeze(f8)}\n")

f9 = inference([f1,f2,f3],[C,B],[A],[])
print(f"f9={np.squeeze(f9)}\n")



# This example is for the credit card Fraud
#
#
#
#
#
#
#
#
#
var_map_int = {
    'Acc': 0,
    'Fraud': 1,
    'Trav': 2,
    'FP': 3,
    'OP': 4,
    'PT': 5
}
var_map_string = {
	0: 'Acc',
	1: 'Fraud',
	2: 'Trav',
	3: 'FP',
	4: 'OP',
	5: 'PT'
}
# the dimensions go as follows
# (acc, fraud, trav, fp, op, pt)
# now encode the follwoing
# given a list of strings with the variable names {Acc, Fraud, Trav, FP, OP, PT}
# and retunr a tuple that gives 2 as the dimension if hte string is in the list
# and 1 otherwise
def get_dimensions(variables, var_map=var_map_int):
	dimensions = []
	# iterate through var_map
	for key in var_map:
		# if the key is in variables then append 2
		if key in variables:
			dimensions.append(2)
		# else append 1
		else:
			dimensions.append(1)
	return tuple(dimensions)


# every factor must have 6 dimensions

# P(Trav)
trav_prob = np.array([0.95, 0.05])
f1 = trav_prob.reshape(get_dimensions(['Trav']))


# Pr(Fraud | Trav)
cpt = np.array([[0.996, 0.99], [0.004, 0.01]])
tup = get_dimensions(['Fraud', 'Trav'])
f2 = cpt.reshape(tup)
# Pr(FP | Fraud, Trav)
cpt = np.array([
	[[0.99,0.01],[0.1,0.9]],[[0.9,0.1],[0.1,0.9]]
])
tup = get_dimensions(['FP', 'Fraud', 'Trav'])
f3 = cpt.reshape(tup)

# Pr(PT | Acc)
cpt = np.array([[0.99,0.01],[0.1,0.9]])
tup = get_dimensions(['PT', 'Acc'])
f4 = cpt.reshape(tup)
# Print the conditional probability table





# Pr(OP | Acc, Fraud)
cpt = np.array([
	[[0.9,0.1],[0.7,0.3]],[[0.4,0.6],[0.2,0.8]]
])
tup = get_dimensions(['OP', 'Acc', 'Fraud'])
f5 = cpt.reshape(tup)
# Print the conditional probability table

# Pr(OP | Acc, Fraud)
cpt = np.array([
	0.2,0.8
])
tup = get_dimensions(['Acc'])
f6 = cpt.reshape(tup)
# Print the conditional probability table

# def inference(factor_list, query_variables, ordered_list_of_hidden_variables, evidence_list):
# solve for P(F|FP, ¬OP, PT) using inference apply var_map_ints to the variables
factor_list = [f1, f2]
query_variables = ['Fraud']
query_variables = [var_map_int[x] for x in query_variables]
ordered_list_of_hidden_variables = ['Trav']
ordered_list_of_hidden_variables = [var_map_int[x] for x in ordered_list_of_hidden_variables]
evidence_list = [('FP', true), ('OP', false), ('PT', true)]
evidence_list = [(var_map_int[x], y) for (x, y) in evidence_list]
f7 = inference(factor_list, query_variables, ordered_list_of_hidden_variables, evidence_list)
print(f"P(F|FP, ¬OP, PT)={np.squeeze(f7)}\n")
