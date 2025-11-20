Approach for O(N) SOLUTION
AIM: Return the second largest unique number.

Use two variables:
- largest
- second

For each number:
1. Skip if it matches largest or second (handles duplicates)
2. If n > largest → shift largest to second, update largest
3. Else if n fits between largest and second → update second

At the end, return:
- second if exists
- -1 otherwise

Time Complexity: O(n)
Space Complexity: O(1)

