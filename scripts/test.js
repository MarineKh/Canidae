/**
 * Created by Marine on 15.03.17.
 */
$('.dec').on('click',function(e) {
    if(-4 < i) {
        i--
    } else if(i == -4) {
        i = 0;
    }
    $(e.target).parent().find('.inputText').val(i);
});

// $('.inc').click(function(e) {
//     (4 > i) ? ++i : i = 0;
//     $(e.target).parent().find('.inputText').val(i);
//
// });
// $('.dec').click(function(e) {
//     (-4 < i) ? (i--) : (i == -4) ? i = 0 : i = 0;
//     $(e.target).parent().find('.inputText').val(i);
// });


var elements = $('.range');
var total = 0;
for(var i = 0; i < elements.length; i++) {
    total += parseInt($(elements[i]).attr('max'));
    console.log(total);
}
var input = elem.find('input');
switch(true) {
    case input.is('.inputText'):
        $('.inputText').val(0);
        break;
    case input.is('.range'):
        $('.range').attr('disabled', 'disabled');
        // .val(function () {
        //     return $(this).prop('min');
        //     console.log(11);
        // });
        break;
    case input.is('[type=button]'):
        input.attr('disabled', 'disabled');
        break;
    case input.is('[type=radio]'):
        input.attr('disabled', 'disabled').prop('checked', false);
        break;
    default:
        elem.find('.range', '.inputText', '[type=radio]', '[type=button]' ).removeAttr('disabled');
}

var $progress = $('#progress'),
    $meter = $('#meter'),
    $ranges  = $('[type=range]'),
    $progressVal = $progress.val();

//inputs
let i = 0;

function rangesSum() {
    return +$('.range1').val() + (+$('.range2').val()) + (+$('.range3').val()) + (+$('.range4').val());
}

function setPrice() {
    var pr = $progress.val(),
        met = $meter.val();
    $('#price').text((met + pr).toFixed() - 48);
}

$('.inc').on('click',function() {
    if(4 > i) {
        i++;
        $progress.val(i + 48);
    } else if(i == 4) {
        i = 0;
        $progress.val(48);
    }
    $(this).parent().find('.inputText').val(i);
    calcProgress();
    setPrice();
});

$('.dec').on('click',function() {
    if(-4 < i) {
        i--;
        $progress.val(i + 48);
    } else if(i == -4) {
        i = 0;
    }
    $(this).parent().find('.inputText').val(i);
    calcProgress();
    setPrice();
});

function calcProgress() {
    var trs = $('tbody tr'),
        sum = 0;

    trs.each(function (index, item) {
        let radios = $(item).find('[type=radio]'),
            checked = radios.index(radios.filter('[type=radio]:checked'))+1,
            inputVal = $(item).find('[type=text]').val();

        sum += checked * inputVal;
    });
    $('#progress').val($progressVal + sum);
}

$('[type=radio]').click(function() {
    var trs = $('tbody tr'),
        sum = 0;

    trs.each(function (index, item) {
        let radios = $(item).find('[type=radio]'),
            checked = radios.index(radios.filter('[type=radio]:checked'))+1,
            inputVal = $(item).find('[type=text]').val();

        sum += checked * inputVal;
    });

    $('#progress').val($progressVal + sum);
    setPrice();
});

// editable dd
$('dd').click(function() {
    let elem = $(this),
        newText = prompt('Enter text', elem.html());
    if(!(newText == null)) {
        elem.html(newText);
    }
});

//reset
$('.clear').click( function(e) {
    let elem = $(e.target).parent().parent();
    if($('.clear').is(':checked')) {
        elem.find('.inputText').val(0);
        elem.find('[type=button], [type=radio], .range').attr('disabled', 'disabled');
        elem.find('.range').
        val((function () {
            return $(this).prop('min');
        }));
        elem.find('[type=radio]').prop('checked', false);
    } else {
        elem.find('.range, .inputText, [type=radio], [type=button]' ).removeAttr('disabled');
    }
});

// allCheckboxes   kisat
$("#checkCkeckbox").click(function() {
    if($('.clear').is(':checked')) {
        $('.clear').prop('checked', false);
        $('.range, .inputText, [type=radio], [type=button]').removeAttr("disabled");
    } else {
        $('[type=button], [type=radio], .range').attr('disabled', 'disabled');
        $('.clear').prop('checked', true);
        $('[type=radio]').prop('checked', false);
        $('.range').
        val((function () {
            return $(this).prop('min');
        }));
        $('.inputText').val(0);
    }
});

// allRadios
$('th[data-id]').click(function() {
    $('.radio' + $(this).data('id')).click();
    calcProgress();
});

//meter
$('.meter').mousemove(function(e) {
    var $meter = $('#meter'),
        meterMax = +$meter.attr('max'),
        meterOldVal = $meter.val(),
        $rangesSum = 0;
    // $ranges  = $('[type=range]');

    if (1 == e.buttons) {
        if(e.offsetX < 0) {
            e.offsetX = 0;
        }
        var meterVal = (e.offsetX / this.offsetWidth) * meterMax,
            sub = meterVal - meterOldVal;
        $meter.val(meterVal);

        $ranges.each(function(j, range) {
            var $range = $(range),
                rangeMax = +$range.attr('max'),
                rangeOldVal = +$range.val(),
                rangeVal = rangeOldVal + (sub * rangeMax) / meterMax;

            $rangesSum += rangeMax;
            $range.val(rangeVal);
        });
        setPrice();
    }
});

$('.range').mousedown(function() {
    ($(this)).on('input', function() {
        var meterMax = +$meter.attr('max'),
            // $ranges  = $('[type=range]'),
            rangesSum = 0;

        $ranges.each(function(j, range) {
            var $range = $(range),
                rangeMax = +$range.attr('max');
            rangesSum += rangeMax;
        });
        let coefficent = meterMax / rangesSum;

        $meter.val($ranges.toArray().map(item => +$(item).val()).reduce((a, b) => (a + b), 0) * coefficent);
        setPrice();
    });
});