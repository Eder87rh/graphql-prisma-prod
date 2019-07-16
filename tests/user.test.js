import { getFirstName, isValidPassword } from '../src/utils/user';

test('Should return first name when given full name', () => {
  const firstName = getFirstName('Eder Ramírez');
  expect(firstName).toBe("Eder");
});

test('Should return first name when given first name', () => {
  const firstName = getFirstName('Jen');
  expect(firstName).toBe('Jen');
});

test('Shoul reject password shorter than 8 characters', () => {
  const password = isValidPassword('pr123');
  expect(password).toBeFalsy();
});

test('Shoul reject that password contains the word password', () => {
  const password = isValidPassword('123password1..');
  expect(password).toBeFalsy();
});

test('Shoul be a valid password', () => {
  const password = isValidPassword('123456789');
  expect(password).toBeTruthy();
});