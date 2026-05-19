def test_assert_fake():
    original = 1
    expected = 1

    result = original == expected

    assert result is True
