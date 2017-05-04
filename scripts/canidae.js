const STATIC_PROGRESS_VAL = 48,
    STEP_VAL = 4,
    DD_TEXT = 'Enter text'; //USE STATIC CLASS BUG 8

let $meter = $('#meter'),
    meterMax = +$meter.attr('max'),
    $progress = $('#progress'),
    progressVal = $progress.val(),
    $radios = $(':radio'),
    $ranges  = $('[type=range]'),
    $topCkeckbox = $('#topCkeckbox'),
    $trs = $('tbody tr'),
    i = 0;

//inputs
$('.inc').click(function() {
    if(STEP_VAL > i) {
        $progress.val(++i + STATIC_PROGRESS_VAL);
    } else if(STEP_VAL == i) {
        i = 0;
        $progress.val(STATIC_PROGRESS_VAL);
    }
    $(this).parent().find('.inputText').val(i);
    calcProgress();
    setPrice();
});

$('.dec').click(function() {
    if(-STEP_VAL < i) {
        $progress.val(--i + STATIC_PROGRESS_VAL);
    } else if(-STEP_VAL == i) {
        i = 0;
    }
    $(this).parent().find('.inputText').val(i);
    calcProgress();
});

// editable dd
$('dd').click(function() {
    let $elem = $(this),
        newText = prompt(DD_TEXT, $elem.html());
    if(null == newText) {
        return;
    }
    $elem.html(newText);

});

// check all
$('th[data-id]').click(function() {
    $(`.radio${$(this).data('id')}`).click();//BUG 5
    calcProgress();
});

function reset(finds) {
    if(finds('.clear').is(':checked')) {
        finds('.inputText').val(0);
        finds('.range, :button, :radio').attr('disabled', 'disabled');
        finds('.range').
        val((function () {
            return $(this).prop('min');
        }));
        $('#meter').val(0);
    } else {
        finds('.range, :button, .inputText, :radio' ).removeAttr('disabled');
    }
}

$('.clear').click( function(e) {
    let finds = $(e.target).parent().parent();
    reset(finds.find.bind(finds));
});

$(':checkbox.clear').change(function() {
    let check = $(':checkbox.clear');

    $topCkeckbox[0].checked = check.length == check.filter(':checked').length;

    switch(check.filter(':checked').length) {
        case 0:
        case 4:
            $topCkeckbox.removeClass('notAll');
            break;
        default:
            $topCkeckbox.addClass('notAll');
    }
});

$topCkeckbox.click(function() {
    let that = this;
    $('.clear').each(function (i, elem) {
        elem.checked = that.checked;
    });
    reset($);
});

//meter
$('.meter').mousemove(function(e) {
    let meterOldVal = $meter.val(),
        rangesSum = 0;

    if (1 == e.buttons) {
        if(e.offsetX < 0) {
            e.offsetX = 0;
        }
        let meterVal = (e.offsetX / this.offsetWidth) * meterMax,
            sub = meterVal - meterOldVal;

        $meter.val(meterVal);

        $ranges.each(function(j, range) {
            let $range = $(range),
                rangeMax = +$range.attr('max'),
                rangeOldVal = +$range.val(),
                rangeVal = rangeOldVal + (sub * rangeMax) / meterMax;

            rangesSum += rangeMax;
            $range.val(rangeVal);
        });
        setPrice();
    }
});

$('.range').mousedown(function() {
   ($(this)).on('input', function() {
       let rangesSum = 0;

       $ranges.each(function(j, range) {
           let $range = $(range);
               rangeMax = +$range.attr('max');
           rangesSum += rangeMax;
       });
       let coefficent = meterMax / rangesSum;

       $meter.val($ranges.toArray().map(item => +$(item).val()).reduce((a, b) => (a + b), 0) * coefficent);
       setPrice();
   });
});

// progress
function calcProgress() {
    let sum = 0;

    $trs.each(function (i, item) {
        let radios = $(item).find(':radio'),
            checked = radios.index(radios.filter(':radio:checked')) + 1,
            inputVal = $(item).find(':text').val();

        sum += checked * inputVal;
    });
    $progress.val(progressVal + sum);
}

$radios.click(function() {
    let sum = 0;

    $trs.each(function (i, item) {
        let radios = $(item).find(':radio'),
            checked = radios.index(radios.filter(':radio:checked')) + 1,//checked 7 BUG
            inputVal = $(item).find(':text').val();

        sum += checked * inputVal;
    });
    $progress.val(progressVal + sum);
    setPrice();
});

// price
function setPrice() {
    let progressVal = $progress.val(),
        meterVal = $meter.val();
    $('#price').text((meterVal + progressVal).toFixed() - STATIC_PROGRESS_VAL);
}
