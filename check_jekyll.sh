	expected="jekyll 4.2.0"
    actual="`jekyll -v`"

    if [[ $actual != $expected ]]
	then
		echo "Jekyll is not set to the correct version."
        echo "Got: $actual"
        echo "Expected: $expected"
        exit 1
	fi
